/**
  @module ember-flexberry
*/

import Ember from 'ember';
import FlexberryBaseComponent from './flexberry-base-component';

/**
  @class ObjectListViewRowComponent
  @extends FlexberryBaseComponent
*/
export default FlexberryBaseComponent.extend({
  /**
  */
  _expanded: false,

  /**
  */
  _hierarchicalIndent: '&nbsp;',

  /**
  */
  _level: 0,

  /**
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
  */
  _records: Ember.computed(() => Ember.A()),

  /**
  */
  record: Ember.computed(() => ({
    key: undefined,
    data: undefined,
    config: undefined,
  })),

  /**
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
  */
  hasRecords: Ember.computed('records.length', function() {
    return this.get('records.length');
  }),

  /**
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
  */
  tagName: '',

  actions: {
    /**
    */
    expand() {
      this.toggleProperty('_expanded');
    },

    /**
    */
    showLookupDialog(chooseData) {
      this.get('currentController').send('showLookupDialog', chooseData);
    },

    /**
    */
    removeLookupValue(removeData) {
      this.get('currentController').send('removeLookupValue', removeData);
    },
  },

  /**
  */
  init() {
    this._super(...arguments);

    let id = this.get('record.data.id');
    if (id && this.get('inHierarchicalMode')) {
      this.sendAction('loadRecords', id, this, 'records');
    }
  },
});
