/**
 * @module ember-flexberry
 */

import Ember from 'ember';
import FlexberryBaseComponent from './flexberry-base-component';
import { translationMacro as t } from 'ember-i18n';

/**
 * Lookup component for Semantic UI.
 *
 * @class FlexberryLookup
 * @extends FlexberryBaseComponent
 */
var FlexberryLookup = FlexberryBaseComponent.extend({

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
   * @property classChoose
   * @type String
   * @default undefined
   */
  classChoose: undefined,

  /**
   * Classes for remove button.
   *
   * @property classRemove
   * @type String
   * @default undefined
   */
  classRemove: undefined,

  projection: undefined,
  value: undefined,
  relationName: undefined,
  title: undefined,
  cssClass: undefined,

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
   */
  autocompleteClass: Ember.computed(function() {
    if (this.get('autocomplete')) {
      return 'ui search';
    }
  }),

  /**
   * Observes changes to value. Set it to autocompleteValue.
   *
   * @method valueChanged
   */
  valueChanged: Ember.observer('value', function() {
    this.set('autocompleteValue', this.get('value'));
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
   * Method to get url to request autocomplete items.
   *
   * @property autocompleteUrl
   * @type Action
   * @default undefined
   */
  autocompleteUrl: undefined,

  /**
   * Method to get query options to request autocomplete items.
   *
   * @property autocompleteQueryOptions
   * @type Action
   * @default undefined
   */
  autocompleteQueryOptions: undefined,

  /**
   * Action's name to update model's relation value.
   *
   * @property autocompleteUpdate
   * @type String
   * @default 'updateLookupValue'
   */
  autocompleteUpdateAction: 'updateLookupValue',

  /**
   * Min characters count necessary to call autocomplete.
   *
   * @property autocompleteMinCharacters
   * @type Number
   * @default 1
   */
  autocompleteMinCharacters: 1,

  /**
   * Maximum number of results to show on autocomplete.
   *
   * @property autocompleteMaxResults
   * @type Number
   * @default 10
   */
  autocompleteMaxResults: 10,

  /**
   * Server-side property name of autocomplete property.
   *
   * @property autocompleteProperty
   * @type String
   * @default undefined
   */
  autocompleteProperty: undefined,

  /**
   * Function to limit accessible values.
   *
   * @property limitFunction
   * @type String
   * @default undefined
   */
  limitFunction: undefined,

  /**
   * Object with lookup properties to send on choose action.
   *
   * @property chooseData
   * @type Object
   */
  chooseData: Ember.computed('projection', 'relationName', 'title', 'limitFunction', function() {
    return {
      projection: this.get('projection'),
      relationName: this.get('relationName'),
      title: this.get('title'),
      limitFunction: this.get('limitFunction'),
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

  init() {
    this._super();
    if (this.cssClass !== undefined) {
      var classes = this.cssClass.split(' ');
      for (var i = 0; i < classes.length; i++) {
        var classNameToSet = classes[i].trim();
        if (classNameToSet !== '') {
          if (this.classNames === undefined) {
            this.classNames = [];
          }

          this.classNames.push(classNameToSet);
        }
      }
    }
  },

  // Init component when DOM is ready.
  didInsertElement: function() {
    this._super();

    if (this.get('readonly') || !this.get('autocomplete')) {
      return;
    }

    var autocompleteProperty = this.get('autocompleteProperty');
    if (!autocompleteProperty) {
      throw new Error('autocompleteProperty is undefined.');
    }

    var autocompleteMinCharacters = this.get('autocompleteMinCharacters');
    if (!autocompleteMinCharacters || typeof (autocompleteMinCharacters) !== 'number' || autocompleteMinCharacters <= 0) {
      throw new Error('autocompleteMinCharacters has wrong value.');
    }

    var autocompleteMaxResults = this.get('autocompleteMaxResults');
    if (!autocompleteMaxResults || typeof (autocompleteMaxResults) !== 'number' || autocompleteMaxResults <= 0) {
      throw new Error('autocompleteMaxResults has wrong value.');
    }

    var relationName = this.get('relationName');
    if (!relationName) {
      throw new Error('relationName is not defined.');
    }

    let autocompleteUrl = this.get('autocompleteUrl')(relationName);
    let limitFunction = this.get('limitFunction');
    let modelToLookup = this.get('relatedModel');

    this.set('autocompleteValue', this.get('value'));
    let _this = this;
    this.$().search({
      apiSettings: {
        url: autocompleteUrl,
        beforeSend: function(settings) {
          let urlOptions = _this.get('autocompleteQueryOptions')(
            {
              relationName: relationName,
              lookupLimitFunction: limitFunction,
              top: autocompleteMaxResults,
              limitField: autocompleteProperty,
              limitValue: settings.urlData.query
            });
          Ember.merge(settings.data, urlOptions);
          return settings;
        }
      },
      fields: {
        results: 'value',
        title: autocompleteProperty
      },
      minCharacters: autocompleteMinCharacters,
      searchFields: [autocompleteProperty],
      cache: false,
      maxResults: autocompleteMaxResults,
      searchFullText: false,
      onSelect: function(result, response) {
        _this.sendAction(
          'autocompleteUpdateAction',
          {
            relationName: relationName,
            modelToLookup: modelToLookup,
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
