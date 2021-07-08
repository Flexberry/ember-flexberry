/**
  @module ember-flexberry
 */

import Mixin from '@ember/object/mixin';

/**
  Sortable column?
  # Need refactoring.
  # Could not find an example of using.

  @class SortableColumn
  @uses <a href="https://www.emberjs.com/api/ember/release/classes/Mixin">Mixin</a>
 */
export default Mixin.create({
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
