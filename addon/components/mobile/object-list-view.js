/**
  @module ember-flexberry
*/

import { computed  } from '@ember/object';
import ObjectListViewComponent from '../object-list-view';

/**
  Mobile version of {{#crossLink "ObjectListViewComponent"}}{{/crossLink}} (with mobile-specific defaults).

  @class Mobile.ObjectListViewComponent
  @extends ObjectListViewComponent
*/
export default ObjectListViewComponent.extend({
  /**
    Flag indicates whether allow to resize columns (if `true`) or not (if `false`).

    @property allowColumnResize
    @type Boolean
    @default false
  */
  allowColumnResize: false,

  /**
    Default cell component that will be used to display values in single column.

    @property {Object} singleColumnCellComponent
    @property {String} [singleColumnCellComponent.componentName='object-list-view-single-column-cell']
    @property {String} [singleColumnCellComponent.componentProperties=null]
  */
  singleColumnCellComponent: undefined,

  /**
    Header title of middlee column.

    @property singleColumnHeaderTitle
    @type String
  */
  singleColumnHeaderTitle: undefined,

  /**
    Total columns count (including additional columns).

    @property colspan
    @type Number
    @readOnly
  */
  colspan: computed('columns.length', 'showHelperColumn', 'showMenuColumn', function() {
    let columnsCount = 1;
    if (this.get('showHelperColumn')) {
      columnsCount += 1;
    }

    if (this.get('showMenuColumn')) {
      columnsCount += 1;
    }

    return columnsCount;
  }),

  init() {
    this._super(...arguments);
    this.set('singleColumnCellComponent', {
      componentName: 'object-list-view-single-column-cell',
      componentProperties: null
    });
  }
});
