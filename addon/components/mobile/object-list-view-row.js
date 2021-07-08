/**
  @module ember-flexberry
*/

import { computed  } from '@ember/object';
import ObjectListViewRowComponent from '../object-list-view-row';

/**
  Mobile version of {{#crossLink "ObjectListViewRowComponent"}}{{/crossLink}} (with mobile-specific defaults).

  @class Mobile.ObjectListViewRowComponent
  @extends ObjectListViewRowComponent
*/
export default ObjectListViewRowComponent.extend({
  /**
    Stores the number of pixels to isolate one level of hierarchy.

    @property _hierarchicalIndent
    @type Number
    @default 10
    @private
  */
  _hierarchicalIndent: 10,

  /**
    Number of pixels to isolate the current level of the hierarchy.

    @property hierarchicalIndent
    @type Number
    @default 10
  */
  hierarchicalIndent: computed({
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
