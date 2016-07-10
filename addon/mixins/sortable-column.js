/**
  @module ember-flexberry
 */

import Ember from 'ember';

/**
  Sortable column?
  # Need refactoring.
  # Could not find an example of using.

  @class SortableColumn
  @uses <a href="http://emberjs.com/api/classes/Ember.Mixin.html">Ember.Mixin</a>
 */
export default Ember.Mixin.create({
  /**
    Sorted.

    @property sorted
    @type Boolean
    @default false
   */
  sorted: false,

  /**
    Sort number.

    Note! Comment: '1-based'.

    @property sortNumber
    @type Number
    @default -1
   */
  sortNumber: -1,

  /**
    Sort ascending.

    @property sortAscending
    @type Boolean
    @default true
   */
  sortAscending: true
});
