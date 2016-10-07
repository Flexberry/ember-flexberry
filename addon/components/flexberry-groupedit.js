/**
  @module ember-flexberry
*/

import Ember from 'ember';
import FlexberryBaseComponent from './flexberry-base-component';
import { translationMacro as t } from 'ember-i18n';

/**
  Component for create, edit and delete detail objects.

  @example
  In order to add component following template can be used:
  ```handlebars
  {{flexberry-groupedit
   componentName="userVotesGroupEdit"
   modelProjection=modelProjection.attributes.userVotes
   content=model.userVotes
   readonly=readonly
   orderable=false
  }}
  ```

  @class FlexberryGroupeditComponent
  @extends FlexberryBaseComponent
*/
export default FlexberryBaseComponent.extend({
  /**
    Name of action to handle row click.
    Action will be send out of the component.

    @property action
    @type String
    @default 'groupEditRowClick'
  */
  action: 'groupEditRowClick',

  /**
    Flag: indicates whether allow to resize columns (if `true`) or not (if `false`).

    If {{#crossLink "UserSettingsService"}}{{/crossLink}} is enabled then saved widths of columns are displayed on component.

    @property allowColumnResize
    @type Boolean
    @default true
  */
  allowColumnResize: true,

  /**
    Classes for buttons (both toolbar and inrow buttons).

    @property buttonClass
    @type String
  */
  buttonClass: undefined,

  /**
    Default cell component that will be used to display values in columns cells.

    @property {Object} cellComponent
    @property {String} [cellComponent.componentName=undefined]
    @property {String} [cellComponent.componentProperties=null]
  */
  cellComponent: {
    componentName: undefined,
    componentProperties: null
  },

  /**
    Content to be displayed (models collection).

    @property content
    @type DS.ManyArray
    @default null
  */
  content: null,

  /**
    Flag: indicates whether to show creation button at toolbar.

    @property createNewButton
    @type Boolean
    @default true
  */
  createNewButton: true,

  /**
    Custom classes for table.

    @property customTableClass
    @type String
    @default ''
  */
  customTableClass: '',

  /**
    Flag: indicates whether to show delete button at toolbar.

    @property deleteButton
    @type Boolean
    @default true
  */
  deleteButton: true,

  /**
    Route of edit form.

    @example
    This form is opened after row click
    if flag {{#crossLink "FlexberryGroupeditComponent/editOnSeparateRoute:property"}}{{/crossLink}} is enabled.

    @property editFormRoute
    @type String
  */
  editFormRoute: undefined,

  /**
    Flag: indicates whether records should be edited on separate route.

    @example
    In order to enable properly editing in separate route following properties have to be defined:
    - {{#crossLink "FlexberryGroupeditComponent/editOnSeparateRoute:property"}}{{/crossLink}} has to be set as true,
    - {{#crossLink "FlexberryGroupeditComponent/rowClickable:property"}}{{/crossLink}} has to be set as true,
    - {{#crossLink "FlexberryGroupeditComponent/editFormRoute:property"}}{{/crossLink}} has to be set,
    - {{#crossLink "FlexberryGroupeditComponent/saveBeforeRouteLeave:property"}}{{/crossLink}} can be set.

    ```handlebars
    { {flexberry-groupedit
      ...
      editOnSeparateRoute=true
      rowClickable=true
      rowClick='rowClick'
      editFormRoute=commentsEditRoute
      saveBeforeRouteLeave=needSaveBeforeRouteLeave
      ...
    } }
    ```

    @property editOnSeparateRoute
    @type Boolean
    @default false
  */
  editOnSeparateRoute: false,

  /**
    Additional menu items for dropdown menu in last column of every row.

    @example
    It has to be an array of items that can be set as menu items (see {{#crossLink "FlexberryMenuComponent"}}{{/crossLink}}).
    ```
    [{
       icon: 'trophy icon',
       title: 'Some localized item name',
       onClick: function() {
        alert('Take the cake off the shelf.');
       }
     }]
    ```

    For in-row menu following properties are used:
    - {{#crossLink "FlexberryGroupeditComponent/showDeleteMenuItemInRow:property"}}{{/crossLink}},
    - {{#crossLink "FlexberryGroupeditComponent/showEditMenuItemInRow:property"}}{{/crossLink}},
    - {{#crossLink "FlexberryGroupeditComponent/menuInRowAdditionalItems:property"}}{{/crossLink}}.

    @property menuInRowAdditionalItems
    @type Array
    @default null
  */
  menuInRowAdditionalItems: null,

  /**
    Model projection which should be used to display given content.
    Properties of objects by model projection are displayed on component.

    @property modelProjection
    @type Object
    @default null
  */
  modelProjection: null,

  /**
    Main model projection. Accepts object projections.
    Needs for support locales of captions.

    @property mainModelProjection
    @type Object
  */
  mainModelProjection: undefined,

  /**
    Flag: indicates whether ordering by clicking on column headers is allowed.

    @example
    If sorting is used then there has to be declaration:
    ```handlebars
     {{flexberry-groupedit
       ...
       orderable=true
       sorting=computedSorting
       sortByColumn=(action "sortByColumn")
       addColumnToSorting=(action "addColumnToSorting")}}
    ```

    @property orderable
    @type Boolean
    @default false
  */
  orderable: false,

  /**
   Text to be displayed in table body, if content is not defined or empty.

   @property placeholder
   @type String
   @default t('components.flexberry-groupedit.placeholder')
  */
  placeholder: t('components.flexberry-groupedit.placeholder'),

  /**
    Flag: indicates whether table rows are clickable (action will be fired after row click).

    @property rowClickable
    @type Boolean
    @default false
  */
  rowClickable: false,

  /**
    Flag: indicates whether to save current model before going to the detail's route.

    @example
    This flag is used when flag {{#crossLink "FlexberryGroupeditComponent/editOnSeparateRoute:property"}}{{/crossLink}} is enabled.

    @property saveBeforeRouteLeave
    @type Boolean
    @default false
  */
  saveBeforeRouteLeave: false,

  /**
    Flag indicates whether to look for changes of model (and displaying corresponding changes on control) or not.

    If flag is enabled component compares current detail array with used on component,
    removes deleted and marked as deleted on model level records, adds created on model level records.

    @property searchForContentChange
    @type Boolean
    @default false
  */
  searchForContentChange: false,

  /**
    Flag: indicates whether to show asterisk icon in first column of every changed row.

    @property showAsteriskInRow
    @type Boolean
    @default true
  */
  showAsteriskInRow: true,

  /**
    Flag: indicates whether to show checkbox in first column of every row.

    @property showCheckBoxInRow
    @type Boolean
    @default true
  */
  showCheckBoxInRow: true,

  /**
    Flag: indicates whether to show delete button in first column of every row.

    @property showDeleteButtonInRow
    @type Boolean
    @default false
  */
  showDeleteButtonInRow: false,

  /**
    Flag: indicates whether to show dropdown menu with delete menu item, in last column of every row.

    For in-row menu following properties are used:
    - {{#crossLink "FlexberryGroupeditComponent/showDeleteMenuItemInRow:property"}}{{/crossLink}},
    - {{#crossLink "FlexberryGroupeditComponent/showEditMenuItemInRow:property"}}{{/crossLink}},
    - {{#crossLink "FlexberryGroupeditComponent/menuInRowAdditionalItems:property"}}{{/crossLink}}.

    @property showDeleteMenuItemInRow
    @type Boolean
    @default false
  */
  showDeleteMenuItemInRow: false,

  /**
    Flag: indicates whether to show dropdown menu with edit menu item, in last column of every row.

    For in-row menu following properties are used:
    - {{#crossLink "FlexberryGroupeditComponent/showDeleteMenuItemInRow:property"}}{{/crossLink}},
    - {{#crossLink "FlexberryGroupeditComponent/showEditMenuItemInRow:property"}}{{/crossLink}},
    - {{#crossLink "FlexberryGroupeditComponent/menuInRowAdditionalItems:property"}}{{/crossLink}}.

    @property showEditMenuItemInRow
    @type Boolean
    @default false
  */
  showEditMenuItemInRow: false,

  /**
    Dictionary with sorting data related to columns.

    @example
    When the component is placed on edit form then this property is initiated as:
    ```handlebars
     { {flexberry-groupedit
       ...
       sorting=computedSorting)} }
    ```

    where {{#crossLink "SortableControllerMixin/computedSorting:property"}}computedSorting is property of SortableControllerMixin{{/crossLink}}.

    @property sorting
    @type Object
    @default null
  */
  sorting: null,

  /**
    Flag: indicates whether table are striped.

    @property tableStriped
    @type Boolean
    @default true
  */
  tableStriped: true,

  actions: {
    /**
      Handles action from object-list-view when no handler for this component is defined.

      @example
      If sorting is used then there has to be declaration:
      ```
      {{flexberry-groupedit
        ...
        orderable=true
        sorting=computedSorting
        sortByColumn=(action "sortByColumn")
        addColumnToSorting=(action "addColumnToSorting")
      }}
      ```

      @method actions.sortByColumn
      @param {Object} column Column to sort by.
    */
    sortByColumn(column) {
      throw new Error('No handler for sortByColumn action set for flexberry-groupedit. ' +
                      'Set handler like {{flexberry-groupedit ... sortByColumn=(action "sortByColumn")}}.');
    },

    /**
      Handles action from object-list-view when no handler for this component is defined.

      @example
      If sorting is used then there has to be declaration:
      ```
      {{flexberry-groupedit
        ...
        orderable=true
        sorting=computedSorting
        sortByColumn=(action "sortByColumn")
        addColumnToSorting=(action "addColumnToSorting")
      }}
      ```

      @method actions.addColumnToSorting
      @param {Object} column Column to add sorting by.
    */
    addColumnToSorting(column) {
      throw new Error('No handler for addColumnToSorting action set for flexberry-groupedit. ' +
                      'Set handler like {{flexberry-groupedit ... addColumnToSorting=(action "addColumnToSorting")}}.');
    },

    /**
      Handles click on row of component.
      Sends primary action out of component.

      @method actions.groupEditRowClick
      @param {Object} record Clicked record.
      @param {Object} options Different parameters to handle action.
    */
    groupEditRowClick(record, options) {
      if (this.get('editOnSeparateRoute')) {
        let editFormRoute = this.get('editFormRoute');
        Ember.assert('Edit form route must be defined for flexberry-groupedit', editFormRoute);
        options = Ember.merge(options, { editFormRoute: editFormRoute });
      }

      this.sendAction('action', record, options);
    }
  },

  /**
    Hook that can be used to confirm delete row.

    @example
      ```handlebars
      <!-- app/templates/example.hbs -->
      {{flexberry-groupedit
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
      {{flexberry-groupedit
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
    Hook that executes before deleting the record.
    Not use async functions.

    @example
      ```handlebars
      <!-- app/templates/employees.hbs -->
      {{flexberry-groupedit
        ...
        beforeDeleteRecord=(action 'beforeDeleteRecord')
        ...
      }}
      ```

      ```javascript
      // app/controllers/employees.js
      import ListFormController from './list-form';

      export default ListFormController.extend({
        actions: {
          beforeDeleteRecord(record, data) {
            if (record.get('myProperty')) {
              data.cancel = true;
            }
          }
        }
      });
      ```

    @method beforeDeleteRecord
    @param {DS.Model} record Deleting record.
    @param {Object} data Metadata.
    @param {Boolean} [data.cancel=false] Flag for canceling deletion.
    @param {Boolean} [data.immediately] See {{#crossLink "ObjectListView/immediateDelete:property"}}{{/crossLink}} property for details.
  */
  beforeDeleteRecord: undefined,
});
