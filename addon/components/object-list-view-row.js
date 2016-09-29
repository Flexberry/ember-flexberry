/**
  @module ember-flexberry
*/

import Ember from 'ember';
import FlexberryBaseComponent from './flexberry-base-component';

/**
  Component for displayed one record in {{#crossLink "ObjectListViewComponent"}}{{/crossLink}}.

  @class ObjectListViewRowComponent
  @extends FlexberryBaseComponent
*/
export default FlexberryBaseComponent.extend({
  /**
    Flag used to display embedded records.

    @property _expanded
    @type Boolean
    @default false
    @private
  */
  _expanded: false,

  /**
    Store the string for building hierarchical indent.

    @property _hierarchicalIndent
    @type String
    @default '&nbsp;'
    @private
  */
  _hierarchicalIndent: '&nbsp;',

  /**
    Level nesting by default.

    @property _level
    @type Number
    @default 0
    @private
  */
  _level: 0,

  /**
    Level nesting current record.

    @property _currentLevel
    @type Number
    @default 0
    @private
  */
  _currentLevel: Ember.computed({
    get() {
      return this.get('_level');
    },
    set(key, value) {
      return this.set('_level', ++value);
    },
  }),

  /**
    Store nested records.

    @property _records
    @type Ember.NativeArray
    @default Empty
    @private
  */
  _records: Ember.computed(() => Ember.A()),

  /**
    Current record.
    - `key` - Ember GUID for record.
    - `data` - Instance of DS.Model.
    - `config` - Object with config for record.

    @property record
    @type Object
  */
  record: Ember.computed(() => ({
    key: undefined,
    data: undefined,
    config: undefined,
  })),

  /**
    Store nested records.

    @property records
    @type Ember.NativeArray
    @default Empty
  */
  records: Ember.computed({
    get() {
      return this.get('_records');
    },
    set(key, value) {
      value.then((records) => {
        records.forEach((record) => {
          let config = Ember.copy(this.get('defaultRowConfig'));
          let configurateRow = this.get('configurateRow');
          if (configurateRow) {
            Ember.assert('configurateRow must be a function', typeof configurateRow === 'function');
            configurateRow(config, record);
          }

          let newRecord = Ember.Object.create({
            key: Ember.guidFor(record),
            data: record,
            config: config,
          });

          this.get('_records').pushObject(newRecord);
        });
      });
      return this.get('records');
    },
  }),

  /**
    Flag indicate whether there nested records.

    @property hasRecords
    @type Boolean
    @default false
  */
  hasRecords: Ember.computed('records.length', function() {
    return this.get('records.length') > 0;
  }),

  /**
    Hierarchical indent based on the current level of nesting.

    @property hierarchicalIndent
    @type String
    @default ''
  */
  hierarchicalIndent: Ember.computed({
    get() {
      let indent = '';
      let hierarchicalIndent = this.get('_hierarchicalIndent');
      let currentLevel = this.get('_currentLevel');
      for (let i = 0; i < currentLevel; i++) {
        indent += hierarchicalIndent;
      }

      return Ember.String.htmlSafe(indent);
    },
    set(key, value) {
      if (value !== undefined) {
        this.set('_hierarchicalIndent', Ember.String.htmlSafe(value).toString());
      }

      return this.get('hierarchicalIndent');
    },
  }),

  /**
    Tag name for the view's outer element. [More info](http://emberjs.com/api/classes/Ember.Component.html#property_tagName).

    @property tagName
    @type String
    @default ''
  */
  tagName: '',

  actions: {
    /**
      Show/hide embedded records.

      @method actions.expand
    */
    expand() {
      this.toggleProperty('_expanded');
    },

    /**
      Redirect action from FlexberryLookupComponent in the controller.

      @method actions.showLookupDialog
      @param {Object} chooseData
    */
    showLookupDialog(chooseData) {
      this.get('currentController').send('showLookupDialog', chooseData);
    },

    /**
      Redirect action from FlexberryLookupComponent in the controller.

      @method actions.removeLookupValue
      @param {Object} removeData
    */
    removeLookupValue(removeData) {
      this.get('currentController').send('removeLookupValue', removeData);
    },
  },

  /**
    Setup a view, but do not finish waking it up. [More info](http://emberjs.com/api/classes/Ember.Component.html#method_init).

    @method init
  */
  init() {
    this._super(...arguments);
    Ember.Logger.debug(`Init object-list-view-row '${this.get('record.key')}' at '${performance.now()}'`);

    let id = this.get('record.data.id');
    if (id && this.get('inHierarchicalMode')) {
      this.sendAction('loadRecords', id, this, 'records');
    }
  },
});
