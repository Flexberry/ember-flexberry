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

    if (this.get('readonly') || !this.get('autocomplete')) {
      return;
    }

    this.set('autocompleteValue', this.get('value'));
    let _this = this;
    this.$('.ui.search').search({
      apiSettings: {
        url: this.get('autocompleteUrl'),
        beforeSend: function(settings) {
          let beforeUrl = settings.url;
          let afterUrl = beforeUrl + '?$filter=contains(FirstName, \'' + settings.urlData.query + '\')'; // TODO: CHANGE IT.
          settings.url = afterUrl;
          return settings;
        }
      },
      fields: {
        results: 'value',
        title: 'FirstName' // TODO: CHANGE IT.
      },
      minCharacters: 3,
      searchFields: ['FirstName'], // TODO: CHANGE IT.
      cache: false,
      maxResults: 10,
      searchFullText: false,
      onSelect: function(result, response) {
        _this.sendAction(
          'autocompleteUpdate',
          {
            relationName: _this.get('relationName'),
            modelToLookup: undefined,
            newRelationValue: result
          });
      }
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
