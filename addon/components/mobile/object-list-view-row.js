/**
  @module ember-flexberry
*/

import Ember from 'ember';
import ObjectListViewRowComponent from '../object-list-view-row';

/**
  Mobile version of {{#crossLink "ObjectListViewRowComponent"}}{{/crossLink}} (with mobile-specific defaults).

  @class Mobile.ObjectListViewRowComponent
  @extends ObjectListViewRowComponent
*/
export default ObjectListViewRowComponent.extend({
  /**
  */
  _hierarchicalIndent: 10,

  /**
  */
  hierarchicalIndent: Ember.computed({
    get() {
      return (this.get('_currentLevel') + 1) * this.get('_hierarchicalIndent');
    },
    set(key, value) {
      if (value !== undefined) {
        this.set('_hierarchicalIndent', +value);
      }

      return this.get('hierarchicalIndent');
    },
  }),
});
