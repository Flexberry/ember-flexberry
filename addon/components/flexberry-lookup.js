/**
 * @module ember-flexberry
 */

import Ember from 'ember';
import { translationMacro as t } from 'ember-i18n';

import QueryBuilder from 'ember-flexberry-data/query/builder';
import { StringPredicate } from 'ember-flexberry-data/query/predicate';

import FlexberryBaseComponent from './flexberry-base-component';

/**
 * Lookup component for Semantic UI.
 *
 * @class FlexberryLookup
 * @extends FlexberryBaseComponent
 */
export default FlexberryBaseComponent.extend({
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

  placeholder: t('flexberry-lookup.placeholder'),
  chooseText: t('flexberry-lookup.choose-button-text'),

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
   * Multimple select.
   *
   * @property multiselect
   * @type Boolean
   * @default false
   * @public
   */
  multiselect: false,

  /**
   * Object with lookup properties to send on choose action.
   *
   * @property chooseData
   * @type Object
   */
  chooseData: Ember.computed('projection', 'relationName', 'title', function() {
    return {
      projection: this.get('projection'),
      relationName: this.get('relationName'),
      title: this.get('title'),
      modelToLookup: this.get('relatedModel'),

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
  _valueObserver : Ember.observer('value', function() {
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

  // Init component when DOM is ready.
  didInsertElement: function() {
    this._super();

    if (this.get('readonly')) {
      return;
    }

    if (this.get('autocomplete')) {
      this._onAutocomplete();
    } else if (this.get('dropdown')) {
      this._onDropdown();
    }
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
    let modelName = relatedModel.constructor.modelName;

    let displayAttributeName = _this.get('displayAttributeName');
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

    let relationName = this.get('relationName');
    if (!relationName) {
      throw new Error('relationName is not defined.');
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
          let builder = new QueryBuilder(store, modelName);

          if (settings.urlData.query) {
            builder.where(new StringPredicate(displayAttributeName).contains(settings.urlData.query));
          }

          store.query(modelName, builder.build()).then((records) => {
            callback({
              success: true,
              results: records.map(i => {
                return {
                  title: i.get(displayAttributeName),
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
          _this.set('displayValue', _this.buildDisplayValue());
        }

        state = 'closed';
        Ember.Logger.debug(`Flexberry Lookup::autocomplete state = ${state}`);
      }
    });
  },

  /**
   * Init component with mode dropdown.
   *
   * @method _onDropdown
   * @private
   */
  _onDropdown: function() {
    let _this = this;
    let store = this.get('store');
    let modelName = this.get('relatedModel').constructor.modelName;
    let minCharacters = this.get('minCharacters');
    let multiselect = this.get('multiselect');
    let displayAttributeName = _this.get('displayAttributeName');
    let relationName = this.get('relationName');
    let relatedModel = this.get('relatedModel');

    this.$('.flexberry-dropdown').dropdown({
      minCharacters: minCharacters,
      allowAdditions: multiselect,
      cache: false,
      apiSettings: {
        responseAsync(settings, callback) {
          console.log('load');
          let builder = new QueryBuilder(store, modelName);

          if (settings.urlData.query) {
            builder.where(new StringPredicate(displayAttributeName).contains(settings.urlData.query));
          }

          store.query(modelName, builder.build()).then((records) => {
            callback({
              success: true,
              results: records.map(i => {
                return {
                  name: i.get(displayAttributeName),
                  value: i
                };
              })
            });
          }, () => {
            callback({ success: false });
          });
        }
      },
      onChange(value) {
        _this.sendAction(
          'updateLookupAction',
          {
            relationName: relationName,
            modelToLookup: relatedModel,
            newRelationValue: value
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
      return '';
    }

    return selectedModel.get(this.get('displayAttributeName'));
  }
});
