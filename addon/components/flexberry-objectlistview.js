/**
  @module ember-flexberry
*/

import Ember from 'ember';
import FlexberryBaseComponent from './flexberry-base-component';
import { translationMacro as t } from 'ember-i18n';

/**
  Component to view list of object.

  @class FlexberryObjectlistview
  @extends FlexberryBaseComponent
*/
export default FlexberryBaseComponent.extend({

  /**
    Text to be displayed in table body, if content is not defined or empty.

    @property placeholder
    @type String
    @default t('components.flexberry-objectlistview.placeholder')
  */
  placeholder: t('components.flexberry-objectlistview.placeholder'),

  /**
    Flag: indicates whether allow to resize columns (if `true`) or not (if `false`).

    @property allowColumnResize
    @type Boolean
    @default true
  */
  allowColumnResize: true,

  /**
    Route for edit form by click row.

    @property editFormRoute
    @type String
  */
  editFormRoute: undefined,

  /**
    Primary action for row click.

    @property action
    @type String
    @default 'objectListViewRowClick'
  */
  action: 'objectListViewRowClick',

  /**
    It indicates current component mode.
     Available values:
     `listform` - simple list form and after row selection it has to be opened corresponding edit form;
     `lookupform` - component is placed on lookup form and after row selection current lookup form has to be closed.

    @property componentMode
    @type String
    @default 'listform'
  */
  componentMode: 'listform',

  /**
    Default cell component that will be used to display values in columns headers.

    @property {Object} headerCellComponent
    @property {String} [headerCellComponent.componentName='object-list-view-header-cell']
    @property {String} [headerCellComponent.componentProperties=null]
  */
  headerCellComponent: {
    componentName: 'object-list-view-header-cell',
    componentProperties: null,
  },

  /**
    Default cell component that will be used to display values in columns cells.

    @property {Object} cellComponent
    @property {String} [cellComponent.componentName='object-list-view-cell']
    @property {String} [cellComponent.componentProperties=null]
  */
  cellComponent: {
    componentName: 'object-list-view-cell',
    componentProperties: null,
  },

  /**
    Flag indicates whether to show asterisk icon in first column of every changed row.

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
  showCheckBoxInRow: false,

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
    @default false
  */
  showEditMenuItemInRow: false,

  /**
    Flag indicates whether to show dropdown menu with delete menu item, in last column of every row.

    @property showDeleteMenuItemInRow
    @type Boolean
    @default false
  */
  showDeleteMenuItemInRow: false,

  /**
    Additional menu items for dropdown menu in last column of every row.

    @property menuInRowAdditionalItems
    @type Boolean
    @default null
  */
  menuInRowAdditionalItems: null,

  /**
    Flag indicates whether table are striped.

    @property tableStriped
    @type Boolean
    @default true
  */
  tableStriped: true,

  /**
    Flag indicates whether table rows are clickable.

    @property rowClickable
    @type Boolean
    @default true
  */
  rowClickable: true,

  /**
    Custom classes for table.

    @property customTableClass
    @type String
    @default ''
  */
  customTableClass: '',

  /**
    Flag indicates whether ordering by clicking on column headers is allowed.

    @property headerClickable
    @type Boolean
    @default false
  */
  orderable: false,

  /**
    Dictionary with sorting data related to columns.

    @property sorting
    @type Object
    @default null
  */
  sorting: null,

  /**
    Model projection which should be used to display given content.

    @property modelProjection
    @type Object
    @default null
  */
  modelProjection: null,

  /**
    Content to be displayed (models collection).

    @property content
    @type DS.ManyArray
    @default null
  */
  content: null,

  /**
    Model's name. Used by toolbar.

    @property modelName
    @type String
    @default null
  */
  modelName: null,

  /**
    Classes for buttons.

    @property buttonClass
    @type String
  */
  buttonClass: undefined,

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
   * Flag indicates whether to show colsConfigButton button at toolbar.
   *
   * @property colsConfigButton
   * @type Boolean
   * @default false
   */
  colsConfigButton: true,

  /**
    Flag indicates whether to show filter button at toolbar.

    @property filterButton
    @type Boolean
    @default false
  */
  filterButton: false,

  /**
    Used to specify 'filter by any match' field value.

    @property filterText
    @type String
    @default null
  */
  filterText: null,

  /**
    Array of pages to show.

    @property pages
    @type DS.ManyArray
    @default null
  */
  pages: null,

  /**
    Current number of records to show per page.

    @property perPageValue
    @type Number
    @default null
  */
  perPageValue: null,

  /**
    Array of numbers of records to show on one page.

    @property perPageValues
    @type DS.ManyArray
    @default null
  */
  perPageValues: null,

  /**
    Function to determine if current page has previous page.

    @property hasPreviousPage
    @type Function
    @default null
  */
  hasPreviousPage: null,

  /**
   * Function to determine if current page has next page.

    @property hasNextPage
    @type Function
    @default null
  */
  hasNextPage: null,

  /**
    Current selected record of list.

    @property selectedRecord
    @type DS.Model
  */
  selectedRecord: undefined,

  /**
    Set of properties to set for commponent (when it is used on lookup window).

    @property customProperties
    @type Object
  */
  customProperties: undefined,

  actions: {
    /**
      Handles action from object-list-view when no handler for this component is defined.

      @method actions.sortByColumn
      @public
      @param {Object} column Column to sort by
    */
    sortByColumn(column) {
      throw new Error('No handler for sortByColumn action set for flexberry-objectlistview. ' +
                      'Set handler like {{flexberry-objectlistview ... sortByColumn=(action "sortByColumn")}}.');
    },

    /**
      Handles action from object-list-view when no handler for this component is defined.

      @method actions.addColumnToSorting
      @public
      @param {Object} column Column to add sorting by
    */
    addColumnToSorting(column) {
      throw new Error('No handler for addColumnToSorting action set for flexberry-objectlistview. ' +
                      'Set handler like {{flexberry-objectlistview ... addColumnToSorting=(action "addColumnToSorting")}}.');
    },

    /**
      Handles action from row click (action is handled at route so it can't be closure action now).

      @method actions.objectListViewRowClick
      @public
      @param {Object} record Clicked record
    */
    objectListViewRowClick(record) {
      if (this.get('componentMode') === 'lookupform') {
        this.sendAction('action', record);
      } else {
        let editFormRoute = this.get('editFormRoute');
        Ember.assert('Edit form route must be defined for flexberry-objectlistview', editFormRoute);
        this.sendAction('action', record, editFormRoute);
      }
    },

    /**
      Handles action from object-list-view when no handler for this component is defined.

      @method actions.previousPage
      @public
    */
    previousPage() {
      throw new Error('No handler for previousPage action set for flexberry-objectlistview. ' +
                      'Set handler like {{flexberry-objectlistview ... previousPage=(action "previousPage")}}.');
    },

    /**
      Handles action from object-list-view when no handler for this component is defined.

      @method actions.nextPage
      @public
    */
    nextPage() {
      throw new Error('No handler for nextPage action set for flexberry-objectlistview. ' +
                      'Set handler like {{flexberry-objectlistview ... nextPage=(action "nextPage")}}.');
    },

    /**
      Handles action from object-list-view when no handler for this component is defined.

      @method actions.gotoPage
      @public
      @param {Number} pageNumber Number of page to go to
    */
    gotoPage(pageNumber) {
      throw new Error('No handler for gotoPage action set for flexberry-objectlistview. ' +
                      'Set handler like {{flexberry-objectlistview ... gotoPage=(action "gotoPage")}}.');
    },

    /**
      Array of custom user buttons.

      @example
        ```
        {
          buttonName: '...', // Button displayed name.
          buttonAction: '...', // Action that is called from controller on this button click (it has to be registered at component).
          buttonClasses: '...' // Css classes for button.
        }
        ```

      @example
        Example of how to add user buttons:
        1) it has to be defined computed property at corresponding controller (name of property is not fixed).
        ```
        import Ember from 'ember';
        import ListFormController from 'ember-flexberry/controllers/list-form';

        export default ListFormController.extend({
          ...
          customButtonsMethod: Ember.computed('i18n.locale', function() {
            let i18n = this.get('i18n');
            return [{
              buttonName: i18n.t('forms.components-examples.flexberry-objectlistview.toolbar-custom-buttons-example.custom-button-name'),
              buttonAction: 'userButtonActionTest',
              buttonClasses: 'my-test-user-button test-click-button'
            }];
          })
        });
        ```

        2) it has to be defined set as 'buttonAction' methods.
        ```
        import Ember from 'ember';
        import ListFormController from 'ember-flexberry/controllers/list-form';

        export default ListFormController.extend({
          ...
          clickCounter: 1,
          messageForUser: undefined,

          actions: {
            userButtonActionTest: function() {
              let i18n = this.get('i18n');
              let clickCounter = this.get('clickCounter');
              this.set('clickCounter', clickCounter + 1);
              this.set('messageForUser',
                i18n.t('forms.components-examples.flexberry-objectlistview.toolbar-custom-buttons-example.custom-message').string +
                ' ' + clickCounter);
            }
          }
        });
        ```

        3) defined methods and computed property have to be registered at component.
        ```
        {{flexberry-objectlistview
          ...
          customButtons=customButtonsMethod
          userButtonActionTest='userButtonActionTest'
        }}
        ```
      @property customButtons
      @type Array
     */
    customButtons() {
      return undefined;
    },

    /**
      Handler to get user button's actions and send action to corresponding controllers's handler.

      @method actions.customButtonAction
      @public
      @param {String} actionName The name of action
    */
    customButtonAction(actionName) {
      if (!actionName) {
        throw new Error('No handler for custom button of flexberry-objectlistview toolbar was found.');
      }

      this.sendAction(actionName);
    },

    /**
      Handles action from object-list-view when no handler for this component is defined.

      @method actions.filterByAnyMatch
      @param {String} The pattern to filter objects
    */
    filterByAnyMatch(pattern) {
      throw new Error('No handler for filterByAnyMatch action set for flexberry-objectlistview. ' +
                      'Set handler like {{flexberry-objectlistview ... filterByAnyMatch=(action "filterByAnyMatch")}}.');
    }
  },

  /**
    Hook that can be used to confirm delete row.

    @example
      ```handlebars
      <!-- app/templates/example.hbs -->
      {{flexberry-objectlistview
        ...
        confirmDeleteRow=(action 'confirmDeleteRow')
        ...
      }}
      ```

      ```javascript
      // app/controllers/example.js
      ...
      actions: {
        ...
        confirmDeleteRow() {
          return confirm('You sure?');
        }
        ...
      }
      ...
      ```

    @method confirmDeleteRow
    @return {Boolean} If `true` then delete row, else cancel.
  */
  confirmDeleteRow: undefined,

  /**
    Hook that can be used to confirm delete rows.

    @example
      ```handlebars
      <!-- app/templates/example.hbs -->
      {{flexberry-objectlistview
        ...
        confirmDeleteRows=(action 'confirmDeleteRows')
        ...
      }}
      ```

      ```javascript
      // app/controllers/example.js
      ...
      actions: {
        ...
        confirmDeleteRows() {
          return confirm('You sure?');
        }
        ...
      }
      ...
      ```

    @method confirmDeleteRows
    @return {Boolean} If `true` then delete selected rows, else cancel.
  */
  confirmDeleteRows: undefined,

  /**
    An overridable method called when objects are instantiated.
    For more information see [init](http://emberjs.com/api/classes/Ember.View.html#method_init) method of [Ember.View](http://emberjs.com/api/classes/Ember.View.html).
   */
  init() {
    this._super(...arguments);

    let customProperties = this.get('customProperties');
    if (this.get('componentMode') === 'lookupform' && customProperties && typeof customProperties === 'object') {
      // For lookup mode we allow to set properties.
      this.setProperties(customProperties);
    }
  }
});
