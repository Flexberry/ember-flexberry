/**
  @module ember-flexberry
*/

import FlexberryGroupeditComponent from './../flexberry-groupedit';

/**
  Mobile version of {{#crossLink "FlexberryGroupeditComponent"}}{{/crossLink}} (with mobile-specific defaults).

  @class Mobile.FlexberryGroupeditComponent
  @extends FlexberryGroupeditComponent
  @constructor
*/
export default FlexberryGroupeditComponent.extend({
  /**
    Flag: indicates whether allow to resize columns (if `true`) or not (if `false`).

    It overrides default value of
    {{#crossLink "FlexberryGroupeditComponent/allowColumnResize:property"}}{{/crossLink}}
    of base component.

    @property allowColumnResize
    @type Boolean
    @default false
  */
  allowColumnResize: false,

  /**
    Flag: indicates whether ordering by clicking on column headers is allowed.

    It overrides default value of
    {{#crossLink "FlexberryGroupeditComponent/orderable:property"}}{{/crossLink}}
    of base component.

    @property orderable
    @type Boolean
    @default false
  */
  orderable: false,

  /**
    Flag: indicates whether table rows are clickable.

    It overrides default value of
    {{#crossLink "FlexberryGroupeditComponent/rowClickable:property"}}{{/crossLink}}
    of base component.

    @property rowClickable
    @type Boolean
    @default false
  */
  rowClickable: false,

  /**
    Flag: indicates whether to show asterisk icon in first column of every changed row.

    It overrides default value of
    {{#crossLink "FlexberryGroupeditComponent/showAsteriskInRow:property"}}{{/crossLink}}
    of base component.

    @property showAsteriskInRow
    @type Boolean
    @default true
  */
  showAsteriskInRow: undefined,

  /**
    Flag: indicates whether to show checkbox in first column of every row.

    It overrides default value of
    {{#crossLink "FlexberryGroupeditComponent/showCheckBoxInRow:property"}}{{/crossLink}}
    of base component.

    @property showCheckBoxInRow
    @type Boolean
    @default true
  */
  showCheckBoxInRow: true,

  /**
    Flag: indicates whether to show delete button in first column of every row.

    It overrides default value of
    {{#crossLink "FlexberryGroupeditComponent/showDeleteButtonInRow:property"}}{{/crossLink}}
    of base component.

    @property showDeleteButtonInRow
    @type Boolean
    @default true
  */
  showDeleteButtonInRow: true,

  /**
    Flag: indicates whether to show dropdown menu with delete menu item, in last column of every row.

    It overrides default value of
    {{#crossLink "FlexberryGroupeditComponent/showDeleteMenuItemInRow:property"}}{{/crossLink}}
    of base component.

    @property showDeleteMenuItemInRow
    @type Boolean
    @default false
  */
  showDeleteMenuItemInRow: false,

  /**
    Flag: indicates whether to show dropdown menu with edit menu item, in last column of every row.

    It overrides default value of
    {{#crossLink "FlexberryGroupeditComponent/showEditMenuItemInRow:property"}}{{/crossLink}}
    of base component.

    @property showEditMenuItemInRow
    @type Boolean
    @default false
  */
  showEditMenuItemInRow: false,

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
