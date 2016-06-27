/**
 * @module ember-flexberry
 */

import Ember from 'ember';
import { translationMacro as t } from 'ember-i18n';

import QueryBuilder from 'ember-flexberry-data/query/builder';
import { BasePredicate, StringPredicate, ComplexPredicate } from 'ember-flexberry-data/query/predicate';
import Condition from 'ember-flexberry-data/query/condition';
import { getRelationType } from '../utils/model-functions';

import FlexberryBaseComponent from './flexberry-base-component';

/**
 * Lookup component for Semantic UI.
 *
 * @class FlexberryLookup
 * @extends FlexberryBaseComponent
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
   * Default classes for component wrapper.
   *
   * @property classNames
   * @type Array
   * @readOnly
   */
  classNames: ['flexberry-lookup'],

  /**
   * Classes by properties of the component.
   *
   * @property classNameBindings
   * @type Array
   * @readOnly
   */
  classNameBindings: ['autocompleteClass'],

  placeholder: t('components.flexberry-lookup.placeholder'),
  chooseText: t('components.flexberry-lookup.choose-button-text'),

  // ToDo: Use 'flexberry-lookup.remove-button-text' from locale.
  removeText: '<i class="remove icon"></i>',

  /**
   * Classes for choose button.
   *
   * @property chooseButtonClass
   * @type String
   * @default undefined
   */
  chooseButtonClass: undefined,

  /**
   * Classes for remove button.
   *
   * @property removeButtonClass
   * @type String
   * @default undefined
   */
  removeButtonClass: undefined,

  projection: undefined,

  relationName: undefined,
  title: undefined,

  /**
   * Flag to show that lookup is in autocomplete mode.
   *
   * @property autocomplete
   * @type Boolean
   * @default false
   * @public
   */
  autocomplete: false,

  /**
   * Flag to show that lookup is in dropdown mode.
   *
   * @property dropdown
   * @type Boolean
   * @default false
   * @public
   */
  dropdown: false,

  /**
   * Classes by property of autocomplete.
   *
   * @property autocompleteClass
   * @type String
   * @readOnly
   */
  autocompleteClass: Ember.computed('autocomplete', function() {
    if (this.get('autocomplete')) {
      return 'ui search';
    }
  }),

  /**
   * Action's name to update model's relation value.
   *
   * @property updateLookupAction
   * @type String
   * @default 'updateLookupValue'
   * @public
   */
  updateLookupAction: 'updateLookupValue',

  /**
   * Min characters count necessary to call autocomplete.
   *
   * @property minCharacters
   * @type Number
   * @default 1
   * @public
   */
  minCharacters: 1,

  /**
   * Maximum number of results to display on autocomplete or dropdown.
   *
   * @property maxResults
   * @type Number
   * @default 10
   * @public
   */
  maxResults: 10,

  /**
   * Multiple select.
   *
   * @property multiselect
   * @type Boolean
   * @default false
   * @public
   */
  multiselect: false,

  /**
   * Limit function on lookup.
   * It should not be just a string, it has to be predicate function (otherwise an exception will be thrown).
   *
   * @property lookupLimitPredicate
   * @type BasePredicate
   * @default undefined
   * @public
   */
  lookupLimitPredicate: undefined,

  /**
   * This computed property forms a set of properties to send to lookup window.

     Closure action `lookupWindowCustomProperties` is called here if defined,
     otherwise `undefined` is returned.

   * @property _lookupWindowCustomPropertiesData
   * @private
   * @type Object
   * @default undefined
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
   * Object with lookup properties to send on choose action.
   *
   * @property chooseData
   * @type Object
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
   * Object with lookup properties to send on remove action.
   *
   * @property removeData
   * @type Object
   */
  removeData: Ember.computed('relationName', function() {
    return {
      relationName: this.get('relationName'),
      modelToLookup: this.get('relatedModel')
    };
  }),

  /**
   * Current store.
   * Used for loading data for autocomplete and for dropdown.
   *
   * @property store
   * @type DS.Store
   * @protected
   * @readOnly
   */
  store: Ember.inject.service('store'),

  /**
   * Name of the attribute of the model to diplay for the user.
   *
   * @property displayAttributeName
   * @type String
   * @default null
   * @protected
   */
  displayAttributeName: null,

  /**
   * Currently selected instance of the model.
   *
   * @property value
   * @type Object
   * @protected
   */
  value: undefined,

  /**
   * Additional observer of value changings.
   * Updates displayValue.
   */
  _valueObserver: Ember.observer('value', function() {
    this.set('displayValue', this.buildDisplayValue());
  }),

  /**
   * Text that displayed for the user as representation of currently selected value.
   * This property is binded to the view and can be changed by user (it won't be
   * applied to model automatically).
   *
   * @property displayValue
   * @type String
   * @protected
   */
  displayValue: Ember.computed('value', function() {
    return this.buildDisplayValue();
  }),

  init() {
    this._super();
  },

  didDestroyElement() {
    this._super();

    this.removeObserver('i18n.locale', this, this._languageReinit);
  },

  // Init component when DOM is ready.
  didInsertElement() {
    this._super();
    this.addObserver('i18n.locale', this, this._languageReinit);
  },

  // Init component when DOM is ready.
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
   * Init component with autocomplete mode.
   *
   * @method _onAutocomplete
   * @private
   */
  _onAutocomplete: function() {
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
      throw new Error('Required property "displayAttributeName" is not defined.');
    }

    let minCharacters = this.get('minCharacters');
    if (!minCharacters || typeof (minCharacters) !== 'number' || minCharacters <= 0) {
      throw new Error('minCharacters has wrong value.');
    }

    let maxResults = this.get('maxResults');
    if (!maxResults || typeof (maxResults) !== 'number' || maxResults <= 0) {
      throw new Error('maxResults has wrong value.');
    }

    var state;
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
          let builder = new QueryBuilder(store, relationModelName);

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
            _this.set('displayValue', _this.buildDisplayValue());
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
   * Init component with dropdown mode.
   *
   * @method _onDropdown
   * @private
   */
  _onDropdown: function() {
    let _this = this;
    let store = this.get('store');

    let relatedModel = this.get('relatedModel');
    let relationName = this.get('relationName');
    if (!relationName) {
      throw new Error('relationName is not defined.');
    }

    let relationModelName = getRelationType(relatedModel, relationName);
    let minCharacters = this.get('minCharacters');
    let multiselect = this.get('multiselect');
    let displayAttributeName = _this.get('displayAttributeName');

    let i18n = _this.get('i18n');
    this.$('.flexberry-dropdown').dropdown({
      minCharacters: minCharacters,
      allowAdditions: multiselect,
      cache: false,
      message: {
        noResults: i18n.t('components.flexberry-lookup.dropdown.messages.noResults').string
      },
      apiSettings: {
        responseAsync(settings, callback) {
          console.log('load');
          let builder = new QueryBuilder(store, relationModelName);
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
            callback({
              success: true,
              results: records.map(i => {
                let attributeName = i.get(displayAttributeName);
                resultArray[i.id] = i;
                return {
                  name: attributeName,
                  value: i.id
                };
              })
            });
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
          if (!cachedValues || !cachedValues[value]) {
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

  actions: {
    choose: function(chooseData) {
      if (this.get('readonly')) {
        return;
      }

      this.sendAction('choose', chooseData);
    },
    remove: function(removeData) {
      if (this.get('readonly')) {
        return;
      }

      this.sendAction('remove', removeData);
    }
  },

  /**
   * Builds display text by selected model.
   *
   * @method buildDisplayValue
   * @returns {String}
   * @protected
   */
  buildDisplayValue() {
    let selectedModel = this.get('value');
    if (!selectedModel) {
      this.set('placeholder', t('components.flexberry-lookup.placeholder'));
      return '';
    } else {
      this.set('placeholder', '');
    }

    return selectedModel.get(this.get('displayAttributeName'));
  },

  /**
   * Concatenates predicates.
   *
   * @method _conjuctPredicates
   * @param {BasePredicate} limitPredicate The first predicate to concatenate.
   * @param {BasePredicate} autocompletePredicate The second predicate to concatenate.
   * @return {BasePredicate} Concatenation of two predicates.
   * @throws {Error} Throws error if any of parameter predicates has wrong type.
   */
  _conjuctPredicates: function(limitPredicate, autocompletePredicate) {
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
