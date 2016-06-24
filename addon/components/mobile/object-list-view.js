/**
  @module ember-flexberry
*/

import ObjectListView from './../objectlistview';

/**
  Mobile version of objectlistview (with mobile-specific defaults).

  @class Mobile.ObjectListView
  @extends FlexberryObjectListView
*/
export default ObjectListView.extend({
  /**
    Flag indicates whether allow to resize columns (if `true`) or not (if `false`).

    @property allowColumnResize
    @type Boolean
    @default true
  */
  allowColumnResize: false,

  /**
    Default cell component that will be used to display values in single column.

    @property {Object} singleColumnCellComponent
    @property {String} [singleColumnCellComponent.componentName='object-list-view-single-column-cell']
    @property {String} [singleColumnCellComponent.componentProperties=null]
  */
  singleColumnCellComponent: {
    componentName: 'object-list-view-single-column-cell',
    componentProperties: null
  },

  /**
    Header title of middlee column.

    @property singleColumnHeaderTitle
    @type String
  */
  singleColumnHeaderTitle: undefined,
})
