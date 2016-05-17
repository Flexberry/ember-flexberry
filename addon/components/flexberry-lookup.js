/**
 * @module ember-flexberry
 */

import Ember from 'ember';
import { translationMacro as t } from 'ember-i18n';

import QueryBuilder from 'ember-flexberry-projections/query/builder';
import { StringPredicate } from 'ember-flexberry-projections/query/predicate';

import FlexberryBaseComponent from './flexberry-base-component';

/**
 * Lookup component for Semantic UI.
 *
 * @class FlexberryLookup
 * @extends FlexberryBaseComponent
 */
var FlexberryLookup = FlexberryBaseComponent.extend({
  store: Ember.inject.service('store'),

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
  value: undefined,
  relationName: undefined,
  title: undefined,

  /**
   * Flag to show that lookup is at autocomplete mode.
   *
   * @property autocomplete
   * @type Boolean
   * @default false
   */
  autocomplete: false,

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
   * Observes changes to value.
   *
   * @method valueChanged
   */
  valueChanged: Ember.observer('value', function() {
    let value = this.get('value');
    this.set('autocompleteValue', value);
    if ((value === '') || (value === null)) {
      this.set('placeholder', '');
    } else {
      this.set('placeholder', t('flexberry-lookup.placeholder'));
    }
  }),

  /**
   * Value for autocomplete control.
   * If model's value changes, autocompleteValue is changed too.
   * This property may be changed independently, but it won't be applied to model automatically.
   *
   * @property autocompleteValue
   * @type String
   * @default undefined
   */
  autocompleteValue: undefined,

  /**
   * Action's name to update model's relation value.
   *
   * @property updateLookupAction
   * @type String
   * @default 'updateLookupValue'
   */
  updateLookupAction: 'updateLookupValue',

  /**
   * Min characters count necessary to call autocomplete.
   *
   * @property minCharacters
   * @type Number
   * @default 1
   */
  minCharacters: 1,

  /**
   * Maximum number of results to display on autocomplete or dropdown.
   *
   * @property maxResults
   * @type Number
   * @default 10
   */
  maxResults: 10,

  /**
   * Server-side property name.
   *
   * @property nameProperty
   * @type String
   * @default undefined
   */
  nameProperty: undefined,

  /**
   * Flag to show that lookup is at dropdown mode.
   *
   * @property dropdown
   * @type Boolean
   * @default false
   */
  dropdown: false,

  /**
  * Multimple select.
  *
  * @property multiselect
  * @type Boolean
  * @default false
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
   * Object with lookup properties for a request remote data.
   *
   * @property chooseRemoteData
   * @type Object
   */
  chooseRemoteData: Ember.computed(
    'relationName',
    'relatedModel',
    'nameProperty',
    'minCharacters',
    'maxResults', function() {
    return {
      relationName: this.get('relationName'),
      modelToLookup: this.get('relatedModel'),
      nameProperty: this.get('nameProperty'),
      minCharacters: this.get('minCharacters'),
      maxResults: this.get('maxResults')
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
   * Init component with mode autocomplete.
   *
   * @method onAutocomplete
   * @private
   */
  _onAutocomplete: function() {
    let chooseRemoteData = this.get('chooseRemoteData');
    let _this = this;

    if (!chooseRemoteData.nameProperty) {
      throw new Error('nameProperty is undefined.');
    }

    if (!chooseRemoteData.minCharacters || typeof (chooseRemoteData.minCharacters) !== 'number' || chooseRemoteData.minCharacters <= 0) {
      throw new Error('minCharacters has wrong value.');
    }

    if (!chooseRemoteData.maxResults || typeof (chooseRemoteData.maxResults) !== 'number' || chooseRemoteData.maxResults <= 0) {
      throw new Error('maxResults has wrong value.');
    }

    if (!chooseRemoteData.relationName) {
      throw new Error('relationName is not defined.');
    }

    this.set('autocompleteValue', this.get('value'));

    this.$().search({
      minCharacters: chooseRemoteData.minCharacters,
      maxResults: chooseRemoteData.maxResults,
      cache: false,
      fullTextSearch: false,
      onSelect(result, response) {
        _this.sendAction(
          'updateLookupAction',
          {
            relationName: chooseRemoteData.relationName,
            modelToLookup: chooseRemoteData.modelToLookup,
            newRelationValue: result
          });
      }
    });

    // TODO: find proper way to restore selected value.
    this.$('.prompt').blur(function() {
      if (!_this.$('.ui.search').hasClass('focus')) {
        _this.set('autocompleteValue', _this.get('value'));
      }
    });
  },

  /**
   * Init component with mode dropdown.
   *
   * @method onAutocomplete
   * @private
   */
  _onDropdown: function() {
    let store = this.get('store');
    let chooseRemoteData = this.get('chooseRemoteData');
    let modelName = chooseRemoteData.modelToLookup.constructor.modelName;

    this.$('.flexberry-dropdown').dropdown({
      minCharacters: chooseRemoteData.minCharacters,
      allowAdditions: this.get('multiselect'),
      cache: false,
      fullTextSearch: false,
      apiSettings: {
        responseAsync(settings, callback) {
          let builder = new QueryBuilder(store, modelName);

          if (settings.urlData.query) {
            builder.where(new StringPredicate('FirstName').contains(settings.urlData.query));
          }

          store.query(modelName, builder.build()).then((records) => {
            callback({
              success: true,
              results: records.map(i => {
                return {
                  name: i.get('firstName'),
                  value: i.id
                };
              })
            });
          }, () => {
            callback({ success: false });
          });
        }
      }
    });
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
  }
});

export default FlexberryLookup;
