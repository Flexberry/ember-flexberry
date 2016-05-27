/**
 * @module ember-flexberry
 */

import Ember from 'ember';
import FlexberryBaseComponent from './flexberry-base-component';

/**
 * Component for create, edit and delete detail objects.
 *
 * @class FlexberryGroupedit
 * @extends FlexberryBaseComponent
 */
export default FlexberryBaseComponent.extend({
  actions: {
    /**
     * Handles action from object-list-view when no handler for this component is defined.
     *
     * @method sortByColumn
     * @param {Object} column Column to sort by.
     */
    sortByColumn: function(column) {
      throw new Error('No handler for sortByColumn action set for flexberry-groupedit. ' +
                      'Set handler like {{flexberry-groupedit ... sortByColumn=(action "sortByColumn")}}.');
    },

    /**
     * Handles action from object-list-view when no handler for this component is defined.
     *
     * @method addColumnToSorting
     * @param {Object} column Column to add sorting by.
     */
    addColumnToSorting: function(column) {
      throw new Error('No handler for addColumnToSorting action set for flexberry-groupedit. ' +
                      'Set handler like {{flexberry-groupedit ... addColumnToSorting=(action "addColumnToSorting")}}.');
    },

    /**
     * Handles click on row of groupedit.
     * Sends action out of component.
     *
     * @method groupEditRowClick
     * @param {Object} record Clicked record.
     * @param {Object} options Different parameters to handle action.
     */
    groupEditRowClick: function(record, options) {
      if (this.get('editOnSeparateRoute')) {
        let editFormRoute = this.get('editFormRoute');
        Ember.assert('Edit form route must be defined for flexberry-groupedit', editFormRoute);
        options = Ember.merge(options, { editFormRoute: editFormRoute });
      }

      this.sendAction('action', record, options);
    }
  },

  /**
   * Flag: indicates whether allow to resize columns (if `true`) or not (if `false`).
   *
   * @property allowColumnResize
   * @type Boolean
   * @default true
   */
  allowColumnResize: true,

  /**
   * Route for edit form by click row
   *
   * @property editFormRoute
   * @type String
   * @default 'this.modelName'
   */
  editFormRoute: undefined,

  /**
   * Name of action to handle row click.
   * Action will be send out of the component.
   *
   * @property action
   * @type String
   * @default 'groupEditRowClick'
   */
  action: 'groupEditRowClick',

  /**
   * Default cell component that will be used to display values in columns headers.
   *
   * @property {Object} headerCellComponent
   * @property {String} [headerCellComponent.componentName='object-list-view-header-cell']
   * @property {String} [headerCellComponent.componentProperties=null]
   */
  headerCellComponent: {
    componentName: 'object-list-view-header-cell',
    componentProperties: null
  },

  /**
   * Default cell component that will be used to display values in columns cells.
   *
   * @property {Object} cellComponent
   * @property {String} [cellComponent.componentName='object-list-view-cell']
   * @property {String} [cellComponent.componentProperties=null]
   */
  cellComponent: {
    componentName: 'object-list-view-cell',
    componentProperties: null
  },

  /**
   * Default cell component that will be used to display values in single column.
   *
   * @property {Object} singleColumnCellComponent
   * @property {String} [singleColumnCellComponent.componentName='object-list-view-single-column-cell']
   * @property {String} [singleColumnCellComponent.componentProperties=null]
   */
  singleColumnCellComponent: {
    componentName: 'object-list-view-single-column-cell',
    componentProperties: null
  },

  /**
   * Flag: indicates whether to use single column to display all model properties or not.
   *
   * @property useSingleColumn
   * @type Boolean
   * @default false
   */
  useSingleColumn: false,

  /**
   * Header title of single column.
   *
   * @property singleColumnHeaderTitle
   * @type String
   */
  singleColumnHeaderTitle: undefined,

  /**
   * Flag: indicates whether to show asterisk icon in first column of every changed row.
   *
   * @property showAsteriskInRow
   * @type Boolean
   * @default true
   */
  showAsteriskInRow: true,

  /**
   * Flag: indicates whether to show checkbox in first column of every row.
   *
   * @property showCheckBoxInRow
   * @type Boolean
   * @default true
   */
  showCheckBoxInRow: true,

  /**
   * Flag: indicates whether to show delete button in first column of every row.
   *
   * @property showDeleteButtonInRow
   * @type Boolean
   * @default false
   */
  showDeleteButtonInRow: false,

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
   * Additional menu items for dropdown menu in last column of every row.
   *
   * @property menuInRowAdditionalItems
   * @type boolean
   * @default null
   */
  menuInRowAdditionalItems: null,

  /**
   * Flag: indicates whether table are striped.
   *
   * @property tableStriped
   * @type Boolean
   * @default true
   */
  tableStriped: true,

  /**
   * Flag: indicates whether table rows are clickable.
   *
   * @property rowClickable
   * @type Boolean
   * @default true
   */
  rowClickable: false,

  /**
   * Custom classes for table.
   *
   * @property customTableClass
   * @type String
   * @default ''
   */
  customTableClass: '',

  /**
   * Flag: indicates whether ordering by clicking on column headers is allowed.
   *
   * @property headerClickable
   * @type Boolean
   * @default false
   */
  orderable: false,

  /**
   * Dictionary with sorting data related to columns.
   *
   * @property sorting
   * @type Object
   */
  sorting: null,

  /**
   * Model projection which should be used to display given content.
   *
   * @property modelProjection
   * @type Object
   * @default null
   */
  modelProjection: null,

  /**
   * Content to be displayed (models collection).
   *
   * @property content
   * @type ManyArray
   * @default null
   */
  content: null,

  /**
   * Flag: indicates whether DELETE request should be immediately sended to server (on each deleted record) or not.
   *
   * @property immediateDelete
   * @type Boolean
   * @default false
   */
  immediateDelete: false,

  /**
   * Flag: indicates whether records should be edited on separate route.
   *
   * @property editOnSeparateRoute
   * @type Boolean
   * @default false
   */
  editOnSeparateRoute: false,

  /**
   * Flag: indicates whether to save current model before going to the detail's route.
   *
   * @property saveBeforeRouteLeave
   * @type Boolean
   * @default false
   */
  saveBeforeRouteLeave: false
});
