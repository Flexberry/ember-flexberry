/**
 * @module ember-flexberry
 */

import Ember from 'ember';
import FlexberryBaseComponent from './flexberry-base-component';

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
  classNames: ['flexberry-lookup', 'ui', 'fluid', 'action', 'input'],

  placeholder: '(no value)',
  chooseText: 'Choose',
  removeText: '<i class="remove icon"></i>',

  projection: undefined,
  value: undefined,
  relationName: undefined,
  title: undefined,
  cssClass: undefined,
  items: undefined,
  //items: ["Edit", "Remove", "Hide"],

  /**
   * Flag to show that lookup is at autocomplete mode.
   *
   * @property autocomplete
   * @type Boolean
   * @default false
   */
  autocomplete: false,

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
   * If model's value changes, autocompleteValue is changed too. autocompleteValue may be changed independely, but it won't be applied to model automatically.
   *
   * @property autocompleteValue
   * @type String
   * @default undefined
   */
  autocompleteValue: undefined,

  /**
   * Path to request autocomplete items.
   *
   * @property autocompleteUrl
   * @type String
   * @default undefined
   */
  autocompleteUrl: undefined,

  /**
   * Action's name to update model's relation value.
   *
   * @property autocompleteUpdate
   * @type String
   * @default 'updateLookupValue'
   */
  autocompleteUpdate: 'updateLookupValue',

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
   * Flag to show that lookup is at dropdown mode.
   *
   * @property dropdown
   * @type Boolean
   * @default false
   */
  dropdown: false,

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
      modelToLookup: undefined
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
      modelToLookup: undefined
    };
  }),

  readonly:  false,

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

    let _this = this;

    // for mode dropdown
    this.$('select').on('click', function(chooseData) {
      let getDropdownItems = _this.get('getDropdownItems'); // this.attrs['getDropdownItems']
      let items = getDropdownItems(chooseData);
      _this.set('items', items);
      //_this.set('items', ['Ffff']);
    });

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

    var autocompleteUrl = this.get('autocompleteUrl');
    if (!autocompleteUrl) {
      throw new Error('autocompleteUrl is not defined.');
    }

    var relationName = this.get('relationName');
    if (!relationName) {
      throw new Error('relationName is not defined.');
    }

    this.set('autocompleteValue', this.get('value'));
    this.$('.ui.search').search({
      apiSettings: {
        url: autocompleteUrl,
        beforeSend: function(settings) {
          let beforeUrl = settings.url;
          let afterUrl = beforeUrl + '?$filter=contains(' + autocompleteProperty + ', \'' + settings.urlData.query + '\')'; // TODO: remove odata-specific.
          settings.url = afterUrl;
          return settings;
        }
      },
      fields: {
        results: 'value', // TODO: remove odata-specific.
        title: autocompleteProperty
      },
      minCharacters: autocompleteMinCharacters,
      searchFields: [autocompleteProperty],
      cache: false,
      maxResults: autocompleteMaxResults,
      searchFullText: false,
      onSelect: function(result, response) {
        _this.sendAction(
          'autocompleteUpdate',
          {
            relationName: relationName,
            modelToLookup: undefined,
            newRelationValue: result
          });
      }
    });

    // TODO: find proper way to restore selected value.
    this.$('.prompt').blur(function() {
      _this.set('autocompleteValue', _this.get('value'));
    });
  },

  actions: {
    choose: function(chooseData) {
      this.sendAction('choose', chooseData);
    },
    remove: function(removeData) {
      this.sendAction('remove', removeData);
    }
  }
});

export default FlexberryLookup;
