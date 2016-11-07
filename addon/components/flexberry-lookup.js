/**
  @module ember-flexberry
*/

import Ember from 'ember';
import FlexberryBaseComponent from './flexberry-base-component';

import { translationMacro as t } from 'ember-i18n';
import { getRelationType } from 'ember-flexberry-data/utils/model-functions';
import { Query } from 'ember-flexberry-data';

const {
  Builder,
  Condition,
  BasePredicate,
  StringPredicate,
  ComplexPredicate
} = Query;

/**
  Lookup component for Semantic UI.

  @example
    ```javascript
    // app/controllers/post.js
    import EditFormController from './edit-form';
    export default EditFormController.extend({
      ...
    });
    ```

    ```handlebars
    <!-- app/templates/post.hbs -->
    ...
    {{flexberry-lookup
      choose="showLookupDialog"
      remove="removeLookupValue"
      value=model.author
      projection="UserL"
      relationName="author"
      displayAttributeName="name"
      title="Author"
      placeholder="Not select"
      chooseText="Select"
      removeText="Clear"
    }}
    ...
    ```

  @class FlexberryLookup
  @extends FlexberryBaseComponent
*/
export default FlexberryBaseComponent.extend({
  /**
    This property is used in order to cache loaded for dropdown mode values.
    Values are kept as array with master id as key and master object as value.
    This property is initialized after request to server got dropdown values.
    This cache is important because semantic ui dropdown component lets use only text values,
    while for lookup it is necessary to get object values.

    @property _cachedDropdownValues
    @private
    @type Array
  */
  _cachedDropdownValues: undefined,

  /**
    This property is used in order to cache last value
    of flag {{#crossLink "FlexberryLookup/autocomplete:property"}}{{/crossLink}}
    in order to let init this mode afrer re-render only once if flag was enabled.

    @property _cachedAutocompleteValue
    @private
    @type Boolean
  */
  _cachedAutocompleteValue: undefined,

  /**
    This property is used in order to cache last value
    of flag {{#crossLink "FlexberryLookup/dropdown:property"}}{{/crossLink}}
    in order to let init this mode afrer re-render only once if flag was enabled.

    @property _cachedDropdownValue
    @private
    @type Boolean
  */
  _cachedDropdownValue: undefined,

  /**
    Text to be displayed in field, if value not selected.

    @property placeholder
    @type String
    @default t('components.flexberry-lookup.placeholder')
  */
  placeholder: t('components.flexberry-lookup.placeholder'),

  /**
    Text on button opening a modal window.

    @property chooseText
    @type String
    @default t('components.flexberry-lookup.choose-button-text')
  */
  chooseText: t('components.flexberry-lookup.choose-button-text'),

  /**
    Text on button clear value.

    TODD: Use 'flexberry-lookup.remove-button-text' from locale.

    @property removeText
    @type String
    @default '<i class="remove icon"></i>'
  */
  removeText: '<i class="remove icon"></i>',

  /**
    CSS classes for choose button.

    @property chooseButtonClass
    @type String
  */
  chooseButtonClass: undefined,

  /**
    CSS classes for remove button.

    @property removeButtonClass
    @type String
  */
  removeButtonClass: undefined,

  /**
    Projection name.

    @property projection
    @type String
    @required
  */
  projection: undefined,

  /**
    Relation name.

    @property relationName
    @type String
    @required
  */
  relationName: undefined,

  /**
    Title for modal window.

    @property title
    @type String
  */
  title: undefined,

  /**
    Flag to show that lookup is in autocomplete mode.

    @property autocomplete
    @type Boolean
    @default false
  */
  autocomplete: false,

  /**
    Flag to show that lookup is in dropdown mode.

    @property dropdown
    @type Boolean
    @default false
  */
  dropdown: false,

  /**
    Flag to show that lookup has search or autocomplete in dropdown mode.

    @property dropdownIsSearch
    @type Boolean
    @default false
  */
  dropdownIsSearch: false,

  /**
    Specify direction for sorting by `displayAttributeName`.
    For `autocomplete` or `dropdown` mode only.
    Possible values: `asc` or `desc`.

    @property sorting
    @type String
    @default 'asc'
  */
  sorting: 'asc',

  /**
    Classes by property of autocomplete.

    @property autocompleteClass
    @type String
    @readOnly
  */
  autocompleteClass: Ember.computed('autocomplete', function() {
    if (this.get('autocomplete')) {
      return 'ui search';
    }
  }),

  /**
    Action's name to update model's relation value.

    @property updateLookupAction
    @type String
    @default 'updateLookupValue'
  */
  updateLookupAction: 'updateLookupValue',

  /**
    Maximum number of results to display on autocomplete or dropdown.

    @property maxResults
    @type Number
    @default 10
  */
  maxResults: 10,

  /**
    Limit function on lookup.
    It should not be just a string, it has to be predicate function (otherwise an exception will be thrown).

    @property lookupLimitPredicate
    @type BasePredicate
    @default undefined
  */
  lookupLimitPredicate: undefined,

  /**
    This computed property forms a set of properties to send to lookup window.
    Closure action `lookupWindowCustomProperties` is called here if defined,
    otherwise `undefined` is returned.

    @property _lookupWindowCustomPropertiesData
    @type Object
    @private
  */
  _lookupWindowCustomPropertiesData: Ember.computed(
    'projection',
    'relationName',
    'attrs.lookupWindowCustomProperties',
    function() {
      let lookupWindowCustomProperties = this.attrs.lookupWindowCustomProperties;
      if (lookupWindowCustomProperties) {
        let result = lookupWindowCustomProperties({
          relationName: this.get('relationName'),
          projection: this.get('projection')
        });

        return result;
      }

      return undefined;
    }),

  /**
    Object with lookup properties to send on choose action.

    @property chooseData
    @type Object
    @readOnly
  */
  chooseData: Ember.computed(
    'projection',
    'relationName',
    'title',
    'lookupLimitPredicate',
    '_lookupWindowCustomPropertiesData',
    function() {
      return {
        projection: this.get('projection'),
        relationName: this.get('relationName'),
        title: this.get('title'),
        predicate: this.get('lookupLimitPredicate'),
        modelToLookup: this.get('relatedModel'),
        lookupWindowCustomPropertiesData: this.get('_lookupWindowCustomPropertiesData'),

        //TODO: move to modal settings.
        sizeClass: this.get('sizeClass')
      };
    }),

  /**
    Object with lookup properties to send on remove action.

    @property removeData
    @type Object
    @readOnly
  */
  removeData: Ember.computed('relationName', function() {
    return {
      relationName: this.get('relationName'),
      modelToLookup: this.get('relatedModel')
    };
  }),

  /**
    Current store. Used for loading data for autocomplete and for dropdown.

    @property store
    @type DS.Store
    @readOnly
  */
  store: Ember.inject.service('store'),

  /**
    Name of the attribute of the model to display for the user.
    Is required for autocomplete and dropdown modes.

    @property displayAttributeName
    @type String
    @default null
  */
  displayAttributeName: null,

  /**
    Current selected instance of the model.

    @property value
    @type Object
  */
  value: undefined,

  /**
    Additional observer of value change, updates `displayValue`.

    @method _valueObserver
    @private
  */
  _valueObserver: Ember.observer('value', function() {
    this.set('displayValue', this._buildDisplayValue());
  }),

  /**
    Text that displayed for the user as representation of currently selected value.
    This property is binded to the view and can be changed by user (it won't be applied to model automatically).

    @property displayValue
    @type String
    @readOnly
  */
  displayValue: Ember.computed('value', function() {
    return this._buildDisplayValue();
  }),

  /**
    Standard CSS class names to apply to the view's outer element.
    [More info](http://emberjs.com/api/classes/Ember.Component.html#property_classNames).

    @property classNames
    @type Array
    @readOnly
  */
  classNames: ['flexberry-lookup'],

  /**
    A list of properties of the view to apply as class names.
    [More info](http://emberjs.com/api/classes/Ember.Component.html#property_classNameBindings).

    @property classNameBindings
    @type Array
    @readOnly
  */
  classNameBindings: ['autocompleteClass'],

  /**
    Semantic-ui settings for dropdown.
    For more information see [semantic-ui](http://semantic-ui.com/modules/dropdown.html#/settings)
  */
  on: 'click',
  allowReselection: false,
  allowAdditions: false,
  hideAdditions: true,
  minCharacters: 1,
  match: 'both',
  selectOnKeydown: true,
  forceSelection: true,
  allowCategorySelection: false,
  direction: 'auto',
  keepOnScreen: true,
  fullTextSearch: false,
  preserveHTML: true,
  sortSelect: false,
  showOnFocus: true,
  allowTab: true,
  transition: 'auto',
  duration: 200,

  actions: {
    /**
      Open window for select value.

      @method actions.choose
      @param {Object} chooseData
    */
    choose(chooseData) {
      if (this.get('readonly')) {
        return;
      }

      this.sendAction('choose', chooseData);
    },

    /**
      Clear current value.

      @method actions.remove
      @param {Object} removeData
    */
    remove(removeData) {
      if (this.get('readonly')) {
        return;
      }

      this.sendAction('remove', removeData);
    }
  },

  /**
    It seems to me a mistake here, it should be [willDestroyElement](http://emberjs.com/api/classes/Ember.Component.html#event_willDestroyElement).
    # WRANING!

    @method didDestroyElement
  */
  didDestroyElement() {
    this._super();
    this.removeObserver('i18n.locale', this, this._languageReinit);
  },

  /**
    Called when the element of the view has been inserted into the DOM or after the view was re-rendered.
    [More info](http://emberjs.com/api/classes/Ember.Component.html#event_didInsertElement).

    @method didInsertElement
  */
  didInsertElement() {
    this._super();
    this.addObserver('i18n.locale', this, this._languageReinit);
  },

  /**
    Called after a component has been rendered, both on initial render and in subsequent rerenders.
    [More info](http://emberjs.com/api/classes/Ember.Component.html#event_didRender).

    @method didRender
  */
  didRender() {
    this._super();

    let isAutocomplete = this.get('autocomplete');
    let isDropdown = this.get('dropdown');
    if (isAutocomplete && isDropdown) {
      Ember.Logger.error(
        'Component flexberry-lookup should not have both flags \'autocomplete\' and \'dropdown\' enabled.');
      return;
    }

    let cachedDropdownValue = this.get('_cachedDropdownValue');
    let cachedAutocompleteValue = this.get('_cachedAutocompleteValue');

    if (isAutocomplete && !cachedAutocompleteValue) {
      this._onAutocomplete();
    } else if (isDropdown && !cachedDropdownValue) {
      this._onDropdown();
    }

    this.set('_cachedDropdownValue', isDropdown);
    this.set('_cachedAutocompleteValue', isAutocomplete);
  },

  /**
    Initialize component with autocomplete mode.

    @method _onAutocomplete
    @private
  */
  _onAutocomplete() {
    let _this = this;
    let store = this.get('store');
    let relatedModel = this.get('relatedModel');

    let relationName = this.get('relationName');
    if (!relationName) {
      throw new Error('relationName is not defined.');
    }

    let relationModelName = getRelationType(relatedModel, relationName);

    let displayAttributeName = this.get('displayAttributeName');
    if (!displayAttributeName) {
      Ember.Logger.error('\`displayAttributeName\` is required property for autocomplete mode in \`flexberry-lookup\`.');
      return;
    }

    let minCharacters = this.get('minCharacters');
    if (!minCharacters || typeof (minCharacters) !== 'number' || minCharacters <= 0) {
      throw new Error('minCharacters has wrong value.');
    }

    let maxResults = this.get('maxResults');
    if (!maxResults || typeof (maxResults) !== 'number' || maxResults <= 0) {
      throw new Error('maxResults has wrong value.');
    }

    let state;
    this.$().search({
      minCharacters: minCharacters,
      maxResults: maxResults,
      cache: false,
      apiSettings: {
        /**
         * Mocks call to the data source,
         * Uses query language and store for loading data explicitly.
         *
         * @param {Object} settings
         * @param {Function} callback
         */
        responseAsync(settings, callback) {
          let builder = new Builder(store, relationModelName)
            .select(displayAttributeName)
            .orderBy(`${displayAttributeName} ${_this.get('sorting')}`);

          let autocompletePredicate = settings.urlData.query ?
                                      new StringPredicate(displayAttributeName).contains(settings.urlData.query) :
                                      undefined;
          let resultPredicate = _this._conjuctPredicates(_this.get('lookupLimitPredicate'), autocompletePredicate);
          if (resultPredicate) {
            builder.where(resultPredicate);
          }

          store.query(relationModelName, builder.build()).then((records) => {
            callback({
              success: true,
              results: records.map(i => {
                let attributeName = i.get(displayAttributeName);
                return {
                  title: attributeName,
                  instance: i
                };
              })
            });
          }, () => {
            callback({ success: false });
          });
        }
      },

      /**
       * Handles opening of the autocomplete list.
       * Sets current state (taht autocomplete list is opened) for future purposes.
       */
      onResultsOpen() {
        state = 'opened';
        Ember.Logger.debug(`Flexberry Lookup::autocomplete state = ${state}`);
      },

      /**
       * Handles selection of item from the autocomplete list.
       * Saves selected model and notifies the controller.
       *
       * @param {Object} result Item from array of objects, built in `responseAsync`.
       */
      onSelect(result) {
        state = 'selected';
        Ember.Logger.debug(`Flexberry Lookup::autocomplete state = ${state}; result = ${result}`);

        _this.set('value', result.instance);
        _this.sendAction(
          'updateLookupAction',
          {
            relationName: relationName,
            modelToLookup: relatedModel,
            newRelationValue: result.instance
          });
      },

      /**
       * Handles closing of the autocomplete list.
       * Restores display text if nothing has been selected.
       */
      onResultsClose() {
        // Set displayValue directly because value hasn'been changes
        // and Ember won't change computed property.
        if (state !== 'selected') {
          if (_this.get('displayValue')) {
            _this.set('displayValue', _this._buildDisplayValue());
          } else {
            _this.sendAction('remove', _this.get('removeData'));
          }
        }

        state = 'closed';
        Ember.Logger.debug(`Flexberry Lookup::autocomplete state = ${state}`);
      }
    });
  },

  /**
    Initialize component with dropdown mode.

    @method _onDropdown
    @private
  */
  _onDropdown() {
    let _this = this;
    let store = this.get('store');

    let relatedModel = this.get('relatedModel');
    let relationName = this.get('relationName');
    if (!relationName) {
      throw new Error('relationName is not defined.');
    }

    let relationModelName = getRelationType(relatedModel, relationName);
    let minCharacters = this.get('minCharacters');
    let dropdownIsSearch = this.get('dropdownIsSearch');

    let displayAttributeName = this.get('displayAttributeName');
    if (!displayAttributeName) {
      Ember.Logger.error(' \`displayAttributeName\` is required property for dropdown mode in \`flexberry-lookup\`.');
      return;
    }

    let i18n = _this.get('i18n');
    this.$('.flexberry-dropdown').dropdown({
      minCharacters: dropdownIsSearch ? minCharacters : 0,
      cache: false,
      on: this.get('on'),
      allowReselection: this.get('allowReselection'),
      allowAdditions: this.get('allowAdditions'),
      hideAdditions: this.get('hideAdditions'),
      match: this.get('match'),
      selectOnKeydown: this.get('selectOnKeydown'),
      forceSelection: this.get('forceSelection'),
      allowCategorySelection: this.get('allowCategorySelection'),
      direction: this.get('direction'),
      keepOnScreen: this.get('keepOnScreen'),
      fullTextSearch: this.get('fullTextSearch'),
      preserveHTML: this.get('preserveHTML'),
      sortSelect: this.get('sortSelect'),
      showOnFocus: this.get('showOnFocus'),
      allowTab: this.get('allowTab'),
      transition: this.get('transition'),
      duration: this.get('duration'),
      message: {
        noResults: i18n.t('components.flexberry-lookup.dropdown.messages.noResults').string
      },
      apiSettings: {
        responseAsync(settings, callback) {
          console.log('load');
          let builder = new Builder(store, relationModelName)
            .select(displayAttributeName)
            .orderBy(`${displayAttributeName} ${_this.get('sorting')}`);

          let autocompletePredicate = settings.urlData.query ?
                                      new StringPredicate(displayAttributeName).contains(settings.urlData.query) :
                                      undefined;
          let resultPredicate = _this._conjuctPredicates(_this.get('lookupLimitPredicate'), autocompletePredicate);
          if (resultPredicate) {
            builder.where(resultPredicate);
          }

          store.query(relationModelName, builder.build()).then((records) => {
            // We have to cache data because dropdown component sets text as value and we lose object value.
            let resultArray = [];
            let results = records.map((i) => {
              let attributeName = i.get(displayAttributeName);
              resultArray[i.id] = i;
              return {
                name: attributeName,
                value: i.id
              };
            });

            if (!_this.get('required')) {
              results.unshift({ name: _this.get('placeholder'), value: null });
              resultArray['null'] = null;
            }

            callback({ success: true, results: results });
            _this.set('_cachedDropdownValues', resultArray);
          }, () => {
            callback({ success: false });
          });
        }
      },
      onChange(value) {
        let newValue = value;
        if (value) {
          let cachedValues = _this.get('_cachedDropdownValues');
          if (!cachedValues || cachedValues[value] !== null && !cachedValues[value]) {
            Ember.Logger.error('Can\'t find selected dropdown value among cached values.');
          } else {
            newValue = cachedValues[value];
          }
        }

        _this.sendAction(
          'updateLookupAction',
          {
            relationName: relationName,
            modelToLookup: relatedModel,
            newRelationValue: newValue
          });
      }
    }).dropdown('set text', _this.get('displayValue'));
  },

  /**
    Builds display text by selected model.

    @method _buildDisplayValue
    @returns {String}
    @private
  */
  _buildDisplayValue() {
    let selectedModel = this.get('value');
    let displayAttributeName = this.get('displayAttributeName');
    if (!selectedModel) {
      this.set('placeholder', t('components.flexberry-lookup.placeholder'));
      return '';
    } else {
      this.set('placeholder', '');
    }

    if (!displayAttributeName) {
      Ember.Logger.warn('\`displayAttributeName\` is not defined.');
      return '';
    }

    return selectedModel.get(displayAttributeName);
  },

  /**
    Concatenates predicates.

    @method _conjuctPredicates
    @param {BasePredicate} limitPredicate The first predicate to concatenate.
    @param {BasePredicate} autocompletePredicate The second predicate to concatenate.
    @return {BasePredicate} Concatenation of two predicates.
    @throws {Error} Throws error if any of parameter predicates has wrong type.
  */
  _conjuctPredicates(limitPredicate, autocompletePredicate) {
    if (limitPredicate && !(limitPredicate instanceof BasePredicate)) {
      throw new Error('Limit predicate is not correct. It has to be instance of BasePredicate.');
    }

    if (autocompletePredicate && !(autocompletePredicate instanceof BasePredicate)) {
      throw new Error('Autocomplete predicate is not correct. It has to be instance of BasePredicate.');
    }

    let resultPredicate = (limitPredicate && autocompletePredicate) ?
                          new ComplexPredicate(Condition.And, limitPredicate, autocompletePredicate) :
                          (limitPredicate ?
                            limitPredicate :
                            (autocompletePredicate ?
                              autocompletePredicate :
                              undefined));
    return resultPredicate;
  },

  /**
    Handles changing current locale.
    It reinits autocomplete or dropdown mode (depending on flag) in order to localize messages.

    @method _languageReinit
    @private
  */
  _languageReinit() {
    if (this.get('autocomplete')) {
      this._onAutocomplete();
    } else if (this.get('dropdown')) {
      this._onDropdown();
    }
  }
});
