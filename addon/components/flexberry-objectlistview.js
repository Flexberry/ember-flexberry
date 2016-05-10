/**
 * @module ember-flexberry
 */

import Ember from 'ember';
import FlexberryBaseComponent from './flexberry-base-component';

/**
 * Component to view list of object.
 *
 * @class FlexberryObjectlistview
 * @extends FlexberryBaseComponent
 */
export default FlexberryBaseComponent.extend({
  init: function() {
    this._super(...arguments);
    if (!this.get('editFormRoute')) {
      this.set('editFormRoute', this.get('modelName'));
    }

    let customProperties = this.get('customProperties');
    if (this.get('componentMode') === 'lookupform' && customProperties && typeof customProperties === 'object') {
      // For lookup mode we allow to set properties.
      this.setProperties(customProperties);
    }
  },

  actions: {
    /**
     * Handles action from object-list-view when no handler for this component is defined.
     *
     * @method sortByColumn
     * @param {Object} column Column to sort by.
     */
    sortByColumn: function(column) {
      throw new Error('No handler for sortByColumn action set for flexberry-objectlistview. ' +
                      'Set handler like {{flexberry-objectlistview ... sortByColumn=(action "sortByColumn")}}.');
    },

    /**
     * Handles action from object-list-view when no handler for this component is defined.
     *
     * @method addColumnToSorting
     * @param {Object} column Column to add sorting by.
     */
    addColumnToSorting: function(column) {
      throw new Error('No handler for addColumnToSorting action set for flexberry-objectlistview. ' +
                      'Set handler like {{flexberry-objectlistview ... addColumnToSorting=(action "addColumnToSorting")}}.');
    },

    /**
     * Handles action from row click (action is handled at route so it can't be closure action now).
     *
     * @method rowClick
     * @param {Object} record Clicked record.
     */
    rowClick: function(record) {
      if (this.get('componentMode') === 'lookupform') {
        this.sendAction('action', record);
      } else {
        let editFormRoute = this.get('editFormRoute');
        Ember.assert('Edit form route must be defined for flexberry-objectlistview', editFormRoute);
        this.sendAction('action', record, editFormRoute);
      }
    },

    /**
     * Handles action from object-list-view when no handler for this component is defined.
     *
     * @method previousPage
     */
    previousPage: function() {
      throw new Error('No handler for previousPage action set for flexberry-objectlistview. ' +
                      'Set handler like {{flexberry-objectlistview ... previousPage=(action "previousPage")}}.');
    },

    /**
     * Handles action from object-list-view when no handler for this component is defined.
     *
     * @method nextPage
     */
    nextPage: function() {
      throw new Error('No handler for nextPage action set for flexberry-objectlistview. ' +
                      'Set handler like {{flexberry-objectlistview ... nextPage=(action "nextPage")}}.');
    },

    /**
     * Handles action from object-list-view when no handler for this component is defined.
     *
     * @method gotoPage
     * @param {number} pageNumber Number of page to go to
     */
    gotoPage: function(pageNumber) {
      throw new Error('No handler for gotoPage action set for flexberry-objectlistview. ' +
                      'Set handler like {{flexberry-objectlistview ... gotoPage=(action "gotoPage")}}.');
    },

    /**
     * A stub for call of custom user buttons. Used when no handler is defined.
       When not stab is used (closure action is defined), structured info about custom buttons is returned.
       Closure action has to return an array of structures:

       ```
       {
      	buttonName: '...', // Button displayed name.
      	buttonAction: '...', // Action that is called from controller on this button click (it has to be registered at component).
      	buttonClasses: '...' // Css classes for button.
       }
       ```

      Example of how to add user buttons:
       1) it has to be defined special method (it will be used as closure action) at corresponding controller (name is not fixed).
       ```
       actions: {
        getCustomButtons: function() {
          return [{
          	buttonName: 'UserButton',
          	buttonAction: 'userButtonActionTest',
          	buttonClasses: 'my-test-user-button test-click-button'
          }];
        }
       }
       ```

       2) it has to be defined set as 'buttonAction' methods.
       ```
       actions: {
        userButtonActionTest: function() {
          this.set('header', this.get('header') + ' clicked');
        }
       }
       ```

       3) defined methods have to be registered at conponent.
       ```
       {{flexberry-objectlistview
        ...
        customButtons = (action "getCustomButtons")
        userButtonActionTest = 'userButtonActionTest'
       }}
       ```
     * @method customButtons
     * @return Returns only `undefined` (because it's a stub).
     */
    customButtons: function() {
      return undefined;
    },

    /**
     * Handler to get user button's actions and send action to corresponding controllers's handler.
     *
     * @method customButtonAction
     */
    customButtonAction: function(actionName) {
      if (!actionName) {
        throw new Error('No handler for custom button of flexberry-objectlistview toolbar was found.');
      }

      this.sendAction(actionName);
    },

    /**
     * Handles action from object-list-view when no handler for this component is defined.
     *
     * @method filterByAnyMatch
     * @param {pattern} The pattern to filter objects.
     */
    filterByAnyMatch: function(pattern) {
      throw new Error('No handler for filterByAnyMatch action set for flexberry-objectlistview. ' +
                      'Set handler like {{flexberry-objectlistview ... filterByAnyMatch=(action "filterByAnyMatch")}}.');
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
   * Primary action for row click.
   *
   * @property action
   * @type String
   * @default 'rowClick'
   */
  action: 'rowClick',

  /**
   * It indicates current component mode.
     Available values:
     `listform` - simple list form and after row selection it has to be opened corresponding edit form;
     `lookupform` - component is placed on lookup form and after row selection current lookup form has to be closed.
   *
   * @property componentMode
   * @type String
   * @default `listform`
   */
  componentMode: 'listform',

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
   * @default false
   */
  showAsteriskInRow: false,

  /**
   * Flag: indicates whether to show checkbox in first column of every row.
   *
   * @property showCheckBoxInRow
   * @type Boolean
   * @default false
   */
  showCheckBoxInRow: false,

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
   * Flag: indicates whether table rows are clickable.
   *
   * @property rowClickable
   * @type Boolean
   * @default true
   */
  rowClickable: true,

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
   * Model's name. Used by toolbar.
   *
   * @property modelName
   * @type String
   * @default null
   */
  modelName: null,

  /**
   * Css class for buttons.
   */
  classButton: undefined,

  /**
   * Flag: indicates whether to show creation button at toolbar.
   *
   * @property createNewButton
   * @type Boolean
   * @default false
   */
  createNewButton: false,

  /**
   * Flag: indicates whether to show refresh button at toolbar.
   *
   * @property refreshButton
   * @type Boolean
   * @default false
   */
  refreshButton: false,

  /**
   * Flag: indicates whether to show delete button at toolbar.
   *
   * @property deleteButton
   * @type Boolean
   * @default false
   */
  deleteButton: false,

  /**
   * Flag: indicates whether to show filter button at toolbar.
   *
   * @property filterButton
   * @type Boolean
   * @default false
   */
  filterButton: false,

  /**
   * Used to specify 'filter by any match' field value.
   *
   * @property filterText
   * @type String
   * @default null
   */
  filterText: null,

  /**
   * Array of pages to show.
   *
   * @property pages
   * @type ManyArray
   * @default null
   */
  pages: null,

  /**
   * Current number of records to show per page.
   *
   * @property perPageValue
   * @type number
   * @default null
   */
  perPageValue: null,

  /**
   * Array of numbers of records to show on one page.
   *
   * @property perPageValues
   * @type ManyArray
   * @default null
   */
  perPageValues: null,

  /**
   * Function to determine if current page has previous page.
   *
   * @property hasPreviousPage
   * @type Function
   * @default null
   */
  hasPreviousPage: null,

  /**
   * Function to determine if current page has next page.
   *
   * @property hasNextPage
   * @type Function
   * @default null
   */
  hasNextPage: null,

  /**
   * Current selected record of list.
   *
   * @property selectedRecord
   * @type DS.Model
   * @default undefined
   */
  selectedRecord: undefined,

  /**
   * Set of properties to set for commponent (when it is used on lookup window).
   *
   * @property customProperties
   * @type Object
   * @default undefined
   */
  customProperties: undefined
});
