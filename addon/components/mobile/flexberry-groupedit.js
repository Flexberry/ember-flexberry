/**
 * @module ember-flexberry
 */

import FlexberryGroupedit from './../flexberry-groupedit';

/**
 * Mobile version of flexberry-groupedit (with mobile-specific defaults).
 */
export default FlexberryGroupedit.extend({
  /**
   * Flag: indicates whether to use single column to display all model properties or not.
   *
   * @property useSingleColumn
   * @type Boolean
   * @default false
   */
  useSingleColumn: true,

  /**
   * Flag: indicates whether to show asterisk icon in first column of every changed row.
   *
   * @property showAsteriskInRow
   * @type Boolean
   * @default false
   */
  showAsteriskInRow: true,

  /**
   * Flag: indicates whether to show checkbox in first column of every row.
   *
   * @property showCheckBoxInRow
   * @type Boolean
   * @default false
   */
  showCheckBoxInRow: true,

  /**
   * Flag: indicates whether to show delete button in first column of every row.
   *
   * @property showDeleteButtonInRow
   * @type Boolean
   * @default false
   */
  showDeleteButtonInRow: true,

  /**
   * Flag: indicates whether to show dropdown menu with edit menu item, in last column of every row.
   *
   * @property showEditMenuItemInRow
   * @type Boolean
   * @default false
   */
  showEditMenuItemInRow: false,

  /**
   * Flag: indicates whether to show dropdown menu with delete menu item, in last column of every row.
   *
   * @property showDeleteMenuItemInRow
   * @type Boolean
   * @default false
   */
  showDeleteMenuItemInRow: false,

  /**
   * Flag: indicates whether table rows are clickable.
   *
   * @property rowClickable
   * @type Boolean
   * @default true
   */
  rowClickable: false,

  /**
   * Flag: indicates whether ordering by clicking on column headers is allowed.
   *
   * @property headerClickable
   * @type Boolean
   * @default false
   */
  orderable: false,

  /**
   * Flag: indicates wether allow to resize columns (if `true`) or not (if `false`).
   *
   * @property allowColumnResize
   * @type Boolean
   * @default false
   */
  allowColumnResize: false
});
