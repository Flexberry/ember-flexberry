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
   * Method to get url for a request.
   *
   * @property url
   * @type Action
   * @default undefined
   */
  url: undefined,

  /**
   * Method to get query options for a request.
   *
   * @property queryOptions
   * @type Action
   * @default undefined
   */
  queryOptions: undefined,

  /**
   * Action's name to update model's relation value.
   *
   * @property updateLookupAction
   * @type String
   * @default 'updateLookupValue'
   */
  updateLookupAction: 'updateLookupValue',

  /**
   * Action's name to update xhr before request.
   * It is used to add necessary auth headers to request.
   *
   * @property updateXhrAction
   * @type String
   * @default 'updateLookupXhr'
   */
  updateXhrAction: 'updateLookupXhr',

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
   * Function to limit accessible values.
   *
   * @property limitFunction
   * @type String
   * @default undefined
   */
  limitFunction: undefined,

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
   * Object with lookup properties for a request remote data.
   *
   * @property chooseRemoteData
   * @type Object
   */
  chooseRemoteData: Ember.computed(
    'relationName',
    'relatedModel',
    'limitFunction',
    'url',
    'nameProperty',
    'minCharacters',
    'maxResults', function() {
    return {
      relationName: this.get('relationName'),
      modelToLookup: this.get('relatedModel'),
      limitFunction: this.get('limitFunction'),
      url: this.get('url')(this.get('relationName')),
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
      this.onAutocomplete();
    } else if (this.get('dropdown')) {
      this.onDropdown();
    }
  },

  /**
   * Init component with mode autocomplete.
   *
   * @method onAutocomplete
   * @private
   */
  onAutocomplete: function() {
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
      apiSettings: {
        url: chooseRemoteData.url,
        beforeSend: function(settings) {
          let urlOptions = _this.get('queryOptions')(
            {
              relationName: chooseRemoteData.relationName,
              lookupLimitFunction: chooseRemoteData.limitFunction,
              top: chooseRemoteData.maxResults,
              limitField: chooseRemoteData.nameProperty,
              limitValue: settings.urlData.query
            });
          Ember.merge(settings.data, urlOptions);
          return settings;
        },
        beforeXHR: function(xhr) {
          // Set necessary auth headers.
          _this.sendAction(
            'updateXhrAction',
            {
              xhr: xhr,
              element: _this
            }
          );
        }
      },
      fields: {
        results: 'value',
        title: chooseRemoteData.nameProperty
      },
      minCharacters: chooseRemoteData.minCharacters,
      cache: false,
      maxResults: chooseRemoteData.maxResults,
      fullTextSearch: false,
      onSelect: function(result, response) {
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
  onDropdown: function() {
    let _this = this;
    let chooseRemoteData = this.get('chooseRemoteData');

    this.$('.flexberry-dropdown').dropdown({
      apiSettings: {
        url: chooseRemoteData.url,
        beforeSend: function(settings) {
          let urlOptions = _this.get('queryOptions')(
            {
              relationName: chooseRemoteData.relationName,
              lookupLimitFunction: chooseRemoteData.limitFunction,
              top: chooseRemoteData.maxResults,
              limitField: chooseRemoteData.nameProperty,
              limitValue: settings.urlData.query
            });
          Ember.merge(settings.data, urlOptions);
          return settings;
        },
        beforeXHR: function(xhr) {
          // Set necessary auth headers.
          _this.sendAction(
            'updateXhrAction',
            {
              xhr: xhr,
              element: _this
            }
          );
        }
      },
      fields: {
        remoteValues: 'value',
        name: chooseRemoteData.nameProperty,
        value: chooseRemoteData.nameProperty
      },
      minCharacters: chooseRemoteData.minCharacters,
      cache: false,
      fullTextSearch: false,
      allowAdditions: this.get('multiselect'),
      onChange: function(value, text, $choice) {
        this.sendAction(
          'updateLookupAction',
          {
            relationName: chooseRemoteData.relationName,
            modelToLookup: chooseRemoteData.modelToLookup,
            newRelationValue: value
          });
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
