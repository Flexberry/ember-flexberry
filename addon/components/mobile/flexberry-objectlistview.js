/**
  @module ember-flexberry
*/

import FlexberryObjectlistview from './../flexberry-objectlistview';

/**
  Mobile version of flexberry-objectlistview (with mobile-specific defaults).

  @class Mobile.FlexberryObjectlistview
  @extends FlexberryObjectlistview
*/
export default FlexberryObjectlistview.extend({
  /**
    Flag: indicates whether to show asterisk icon in first column of every changed row.

    @property showAsteriskInRow
    @type Boolean
    @default false
  */
  showAsteriskInRow: false,

  /**
    Flag indicates whether to show checkbox in first column of every row.

    @property showCheckBoxInRow
    @type Boolean
    @default false
  */
  showCheckBoxInRow: true,

  /**
    Flag indicates whether to show delete button in first column of every row.

    @property showDeleteButtonInRow
    @type Boolean
    @default false
  */
  showDeleteButtonInRow: false,

  /**
    Flag indicates whether to show dropdown menu with edit menu item, in last column of every row.

    @property showEditMenuItemInRow
    @type Boolean
    @default true
  */
  showEditMenuItemInRow: true,

  /**
    Flag indicates whether to show dropdown menu with delete menu item, in last column of every row.

    @property showDeleteMenuItemInRow
    @type Boolean
    @default false
  */
  showDeleteMenuItemInRow: false,

  /**
    Flag indicates whether table rows are clickable.

    @property rowClickable
    @type Boolean
    @default true
  */
  rowClickable: true,

  /**
    Flag indicates whether ordering by clicking on column headers is allowed.

    @property orderable
    @type Boolean
    @default false
  */
  orderable: false,

  /**
    Flag indicates whether to show creation button at toolbar.

    @property createNewButton
    @type Boolean
    @default false
  */
  createNewButton: false,

  /**
    Flag indicates whether to show refresh button at toolbar.

    @property refreshButton
    @type Boolean
    @default false
  */
  refreshButton: false,

  /**
    Flag indicates whether to show delete button at toolbar.

    @property deleteButton
    @type Boolean
    @default false
  */
  deleteButton: false,

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
    Header title of single column.

    @property singleColumnHeaderTitle
    @type String
  */
  singleColumnHeaderTitle: undefined,

  init() {
    this._super(...arguments);
    this.set('singleColumnCellComponent', {
      componentName: 'object-list-view-single-column-cell',
      componentProperties: null
    });
  }
});
