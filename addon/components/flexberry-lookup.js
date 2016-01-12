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
   * Path to request autocomplete items.
   *
   * @property url
   * @type String
   * @default undefined
   */
  url: undefined,

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

    // TODO: only for autocomplete.
    this.$('.ui.search').search({
      apiSettings: {
        url: this.get('url'),
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
      searchFullText: false
    });
  },

  actions: {
    choose: function(relationName, projection, title) {
      this.sendAction('choose', relationName, projection, title, undefined);
    },
    remove: function(relationName) {
      this.sendAction('remove', relationName, undefined);
    }
  }
});

export default FlexberryLookup;
