import { A } from '@ember/array';
import { computed, observer, get, set } from '@ember/object';
import { copy } from '@ember/object/internals';
import { inject as service} from '@ember/service';
import { run } from '@ember/runloop';
import { isNone } from '@ember/utils';
import { debug, assert } from '@ember/debug';
import FlexberryBaseComponent from './flexberry-base-component';
import { getRelationType } from 'ember-flexberry-data/utils/model-functions';
import Builder from 'ember-flexberry-data/query/builder';
import Condition from 'ember-flexberry-data/query/condition';
import { BasePredicate, StringPredicate, ComplexPredicate } from 'ember-flexberry-data/query/predicate';

export default FlexberryBaseComponent.extend({
  classNames: ['multiple-lookup'],
  store: service(),

  /**
   * All records.
   */
  records: null,

  /**
   * Filtered records.
   */
  filteredRecords: computed('records.@each.isDeleted', function () {
    return this.get('records').filterBy('isDeleted', false);
  }),

  /**
   * New value path.
   */
  newValuePropertyName: '',

  /**
   * Attribute name for tag value.
   */
  tagDisplayAttributeName: null,

  /**
   * Value.
   */
  value: null,

  /**
   * Lookup value input element.
   */
  lookupInputElement: null,

  /**
   * Flag: all elements in one column.
   */
  isColumnMode: false,

  /**
   * Minimum characters for autocomplete search.
   */
  minCharacters: 1,

  /**
   * Maximum characters for autocomplete search.
   */
  maxResults: 10,

  /**
   * Sorting direction.
   */
  sorting: 'asc',

  /**
   * Lookup visibility.
   */
  chooseComponentVisibility: true,

  /**
   * Lookup visibility based on readonly and visibility flags.
   */
  isChooseComponentVisible: computed('chooseComponentVisibility', 'readonly', function () {
    const isVisible = this.get('chooseComponentVisibility');
    const readonly = this.get('readonly');

    return isVisible && !readonly;
  }),

  /**
    Default settings for tags.

    @property defaultTagConfig
    @type Object

    @param {Boolean} [canBeDeleted=true] The tag can be deleted
    @param {Boolean} [canBeSelected=true] The tag can be selected
    @param {String} [customClass=''] Custom css classes for the tag
  */
  defaultTagConfig: undefined,

  /**
    Hook for configurate tag.

    @example
      ```handlebars
      <!-- app/templates/employees.hbs -->
      {{flexberry-multiple-lookup
        ...
        configurateTag=(action "configurateTag")
        ...
      }}
      ```

      ```js
      // app/controllers/employees.js
      import ListFormController from './list-form';

      export default ListFormController.extend({
        actions: {
          configurateTag(tagConfig, record) {
            set(tagConfig, 'canBeDeleted', false);
            if (record === this.get('myFavoriteRecord')) {
              set(tagConfig, 'canBeSelected', false);
              set(tagConfig, 'customClass', 'my-fav-record');
            }
          }
        }
      });
      ```
    @method configurateTag

    @param {Object} tagConfig Settings for tag.
    @param {DS.Model} record The record in tag.
  */
  configurateTag: undefined,

  /**
   * Add new record by value.
   */
  addNewRecordByValue() {
    this.addNewRecord('value');
  },

  /**
   * Initialization of adding a record by field relatedModel.{relationName}.
   */
  initAddNewRecordByNewValuePropertyName() {
    run.debounce(this, this.addNewRecordByNewValuePropertyName, 500);
  },

  /**
   * Adding a record by field relatedModel.{relationName}.
   */
  addNewRecordByNewValuePropertyName() {
    this.addNewRecord(this.get('newValuePropertyName'));
  },

  /**
   * Adding a record.
   *
   * @param propertyPath
   */
  addNewRecord(propertyPath) {
    const newValue = this.get(propertyPath);
    if (!isNone(newValue)) {
      if (isNone(this.get('filteredRecords').findBy(`${this.get('relationName')}.id`, get(newValue, 'id')))) {
        run.next(() => {
          this.add(newValue);
        });
      }

      this.set(propertyPath, null);
    }
  },

  /**
    Creates an instance of the Builder class with selection and sorting specified in the component parameters.
   *
    @function _createQueryBuilder
    @param {DS.Store} store
    @param {string} modelName
    @param {string} projection
    @param {string} order
    @returns {Builder}
   */
  _createQueryBuilder(store, modelName, projection, order) {
    const sorting = this.get('sorting');
    const displayAttributeName = this.get('displayAttributeName');

    const builder = new Builder(store, modelName);

    if (projection) {
      builder.selectByProjection(projection);
    } else {
      builder.select(displayAttributeName);
    }

    builder.orderBy(`${order ? order : `${displayAttributeName} ${sorting}`}`);

    return builder;
  },

  /**
    Concatenates predicates.
   *
    @function _conjuctPredicates
    @param {BasePredicate} limitPredicate The first predicate to concatenate.
    @param {BasePredicate} autocompletePredicate The second predicate to concatenate.
    @param {Function} lookupAdditionalLimitFunction Function return BasePredicate to concatenate.
    @returns {BasePredicate} Concatenation of two predicates.
    @throws {Error} Throws error if any of parameter predicates has wrong type.
   */
  _conjuctPredicates(limitPredicate, lookupAdditionalLimitFunction, autocompletePredicate) {
    const limitArray = A();

    if (limitPredicate) {
      if (limitPredicate instanceof BasePredicate) {
        limitArray.pushObject(limitPredicate);
      } else {
        throw new Error('Limit predicate is not correct. It has to be instance of BasePredicate.');
      }
    }

    if (autocompletePredicate) {
      if (autocompletePredicate instanceof BasePredicate) {
        limitArray.pushObject(autocompletePredicate);
      } else {
        throw new Error('Autocomplete predicate is not correct. It has to be instance of BasePredicate.');
      }
    }

    if (lookupAdditionalLimitFunction) {
      if ((lookupAdditionalLimitFunction instanceof Function)) {
        const compileAdditionakBasePredicate = lookupAdditionalLimitFunction(this.get('relatedModel'));
        if (compileAdditionakBasePredicate) {
          if (compileAdditionakBasePredicate instanceof BasePredicate) {
            limitArray.pushObject(compileAdditionakBasePredicate);
          } else {
            throw new Error('lookupAdditionalLimitFunction must return BasePredicate.');
          }
        }
      } else {
        throw new Error('lookupAdditionalLimitFunction must to be function.');
      }
    }

    if (limitArray.length > 1) {
      return new ComplexPredicate(Condition.And, ...limitArray);
    } else {
      return limitArray[0];
    }
  },

  /**
   * Building a property to display selected values.
   */
  buildDisplayValue: observer('filteredRecords.[]', 'tagDisplayAttributeName', 'relationName', 'displayAttributeName', function () {
    this.get('filteredRecords').forEach((record) =>
      set(record, 'tagDisplayValue', this.getRecordDisplayValue(record))
    );
  }),

  /**
   * Building a tag configuration property.
   */
  buildConfigurateTags: observer('filteredRecords.[]', 'tagDisplayAttributeName', 'relationName', 'displayAttributeName', function () {
    let configurateTag = this.get('configurateTag');

    this.get('filteredRecords').forEach((record) => {
      let tagConfig = copy(this.get('defaultTagConfig'));
      set(record, 'tagConfig', tagConfig);

      if (configurateTag) {
        assert('configurateTag must be a function', typeof configurateTag === 'function');
        configurateTag(tagConfig, record);
      }
    });
  }),

  /**
    Object with lookup properties to send on remove action.
   *
    @property removeData
    @type Object
    @readOnly
   */
  removeData: computed('relationName', 'relatedModel', function () {
    return {
      relationName: this.get('relationName'),
      modelToLookup: this.get('relatedModel')
    };
  }),

  /**
   * Get the value to display in the tag for the list item.
   *
   * @param record
   */
  getRecordDisplayValue(record) {
    const tagDisplayAttributeName = this.get('tagDisplayAttributeName');
    return !isNone(tagDisplayAttributeName)
      ? get(record, tagDisplayAttributeName)
      : get(record, this.get('relationName') + '.' + this.get('displayAttributeName'));
  },

  init() {
    this._super(...arguments);
    const newValuePropertyName = 'relatedModel.' + this.get('relationName');
    this.set('newValuePropertyName', newValuePropertyName);
    this.set('value', null);
    this.get('filteredRecords').forEach((record) =>
      set(record, 'tagDisplayValue', this.getRecordDisplayValue(record))
    );
    this.addObserver('value', this.addNewRecordByValue);
    this.addObserver(newValuePropertyName, this.initAddNewRecordByNewValuePropertyName);
    this.set('defaultTagConfig', {
      canBeDeleted: true,
      canBeSelected: true,
      customClass: '',
    });
    this.buildConfigurateTags();
  },

  actions: {
    updateLookupValue(updateData) {
      this.get('currentController').send('updateLookupValue', updateData);
    },

    showLookupDialog(chooseData) {
      this.get('currentController').send('showLookupDialog', chooseData);
    },

    delete(record) {
      this.delete(record);
    },

    preview(record) {
      this.preview(record);
    },
  },

  didRender() {
    const _this = this;
    const store = this.get('store');
    const relatedModel = this.get('relatedModel');

    const relationName = this.get('relationName');
    if (isNone(relationName)) {
      // We consider that the component works in block form.
      return;
    }

    const relationModelName = getRelationType(relatedModel, relationName);

    const displayAttributeName = this.get('displayAttributeName');
    if (!displayAttributeName) {
      throw new Error('`displayAttributeName` is required property for autocomplete mode in `flexberry-lookup`.');
    }

    const minCharacters = this.get('minCharacters');
    if (!minCharacters || typeof (minCharacters) !== 'number' || minCharacters <= 0) {
      throw new Error('minCharacters has wrong value.');
    }

    const maxResults = this.get('maxResults');
    if (!maxResults || typeof (maxResults) !== 'number' || maxResults <= 0) {
      throw new Error('maxResults has wrong value.');
    }

    // Add select first autocomplete result by enter click.
    this.$('input').keyup(function (event) {
      if (event.keyCode === 13) {
        const result = _this.$('div.results.transition.visible');
        const activeField = result.children('a.result.active');
        const resultField = result.children('a.result')[0];
        if (resultField && activeField.length === 0) {
          resultField.click();
        }
      }
    });

    let state;
    const i18n = this.get('i18n');
    this.$('.ui.search').search({
      minCharacters: minCharacters,
      maxResults: maxResults + 1,
      cache: false,
      templates: {
        message: function () {
          return '<div class="message empty"><div class="header">' +
            i18n.t('components.flexberry-lookup.dropdown.messages.noResultsHeader').string +
            '</div><div class="description">' +
            i18n.t('components.flexberry-lookup.dropdown.messages.noResults').string +
            '</div></div>';
        }
      },
      apiSettings: {
        /**
          Mocks call to the data source,
          Uses query language and store for loading data explicitly.
         *
          @param {object} settings
          @param {Function} callback
         */
        responseAsync(settings, callback) {
          // Prevent async data-request from being sent in readonly mode.
          if (get(_this, 'readonly')) {
            return;
          }

          const autocompleteProjection = get(_this, 'autocompleteProjection');
          const autocompleteOrder = get(_this, 'autocompleteOrder');

          const builder = _this._createQueryBuilder(store, relationModelName, autocompleteProjection, autocompleteOrder);

          const autocompletePredicate = settings.urlData.query ?
            new StringPredicate(displayAttributeName).contains(settings.urlData.query) :
            undefined;
          const resultPredicate =
            _this._conjuctPredicates(get(_this, 'lookupLimitPredicate'), get(_this, 'lookupAdditionalLimitFunction'), autocompletePredicate);
          if (resultPredicate) {
            builder.where(resultPredicate);
          }

          const maxRes = get(_this, 'maxResults');
          let iCount = 1;
          builder.top(maxRes + 1);
          builder.count();

          run(() => {
            store.query(relationModelName, builder.build()).then((records) => {
              callback({
                success: true,
                results: records.map(i => {
                  const attributeName = get(i, displayAttributeName);
                  if (iCount > maxRes && records.meta.count > maxRes) {
                    return {
                      title: '...'
                    };
                  } else {
                    iCount += 1;
                    return {
                      title: attributeName,
                      instance: i
                    };
                  }
                })
              });
            }, () => {
              callback({ success: false });
            });
          });
        }
      },

      /**
       * Handles opening of the autocomplete list.
       * Sets current state (taht autocomplete list is opened) for future purposes.
       */
      onResultsOpen() {
        state = 'opened';

        run(() => {
          debug(`Flexberry Lookup::autocomplete state = ${state}`);
        });
      },

      /**
       * Handles selection of item from the autocomplete list.
       * Saves selected model and notifies the controller.
       *
       * @param {object} result Item from array of objects, built in `responseAsync`.
       */
      onSelect(result) {
        state = 'selected';

        debug(`Flexberry Lookup::autocomplete state = ${state}; result = ${result}`);
        set(_this, 'value', result.instance);

        // Removing focus is necessary to clear the text in the input field.
        _this.$('input').blur();
        _this.$('.ui.search').search('set value', '');
        _this.$('input').focus();
        return false;
      },

      /**
       * Handles closing of the autocomplete list.
       * Restores display text if nothing has been selected.
       */
      onResultsClose() {
        // Set displayValue directly because value hasn'been changes
        // and Ember won't change computed property.

        _this.$('.ui.search').search('set value', '');
        state = 'closed';

        run(() => {
          debug(`Flexberry Lookup::autocomplete state = ${state}`);
        });
      }
    });
  }
});
