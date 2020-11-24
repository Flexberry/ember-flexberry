/**
  @module ember-flexberry
*/

import Ember from 'ember';
import FlexberryBaseComponent from './flexberry-base-component';
import { translationMacro as t } from 'ember-i18n';
import runAfter from '../utils/run-after';

/**
  Component to view list of object.

  @class FlexberryObjectlistviewComponent
  @extends FlexberryBaseComponent
*/
export default FlexberryBaseComponent.extend({
  /**
    Flag used to display filters.

    @property _showFilters
    @type Boolean
    @default false
    @private
  */
  _showFilters: Ember.computed.oneWay('filters'),

  /**
    Link on {{#crossLink FormLoadTimeTrackerService}}{{/crossLink}}.

    @property formLoadTimeTracker
    @type FormLoadTimeTrackerService
    @private
  */
  formLoadTimeTracker: Ember.inject.service(),

  /**
    Store the action name at controller for loading records.

    @property _loadRecords
    @type String
    @default 'loadRecords'
    @private
  */
  _loadRecords: 'loadRecords',

  /**
    Store the action name at controller for switch to the hierarchical mode.

    @property _switchHierarchicalMode
    @type String
    @default 'switchHierarchicalMode'
    @private
  */
  _switchHierarchicalMode: 'switchHierarchicalMode',

  /**
    Store the action name at controller for switch to the collapse/expand mode.

    @property _switchExpandMode
    @type String
    @default 'switchExpandMode'
    @private
  */
  _switchExpandMode: 'switchExpandMode',

  /**
    Store the action name at controller for save the hierarchical attribute name.

    @property _saveHierarchicalAttribute
    @type String
    @default 'saveHierarchicalAttribute'
    @private
  */
  _saveHierarchicalAttribute: 'saveHierarchicalAttribute',

  /**
    Flag indicate when available the hierarchical mode.

    @property _availableHierarchicalMode
    @type Boolean
    @default false
    @private
  */
  _availableHierarchicalMode: false,

  /**
    Store the attribute name set by `hierarchyByAttribute`.

    @property _hierarchicalAttribute
    @type String
    @private
  */
  _hierarchicalAttribute: undefined,

  /**
    Set the attribute name to hierarchy build.
    If specified, will attempt to build on this attribute hierarchy.

    @property hierarchyByAttribute
    @type String
  */
  hierarchyByAttribute: Ember.computed({
    get() {
      return this.get('_hierarchicalAttribute');
    },
    set(key, value) {
      this.set('_hierarchicalAttribute', value);
      this.sendAction('_saveHierarchicalAttribute', value, true, this.get('componentName'));
      return value;
    },
  }),

  /**
    Set the attribute name to hierarchy build.

    @property hierarchyAttribute
    @type String
  */
  hierarchyAttribute: undefined,

  /**
    The name of a property in the model that determines whether any record is the parent of other records.
    If a property value with this name is defined (not `undefined`), the button to display child records will be shown immediately, and the records will be loaded only when the button is clicked.

    @property isParentRecordPropertyName
    @type String
    @default 'isParentRecord'
  */
  isParentRecordPropertyName: 'isParentRecord',

  /**
    Flag indicate when component is in the hierarchical mode.

    @property inHierarchicalMode
    @type Boolean
    @default false
  */
  inHierarchicalMode: Ember.computed('currentController.inHierarchicalMode', function() {
    return this.get('currentController.inHierarchicalMode');
  }),

  /**
    Flag indicate when component is in the collapse/expand mode.

    @property inExpandMode
    @type Boolean
    @default false
  */
  inExpandMode: Ember.computed('currentController.inExpandMode', function() {
    return this.get('currentController.inExpandMode');
  }),

  /**
    Flag indicate when component in hierarchycal mode has paging.

    @property hierarchyPaging
    @type Boolean
    @default false
  */
  hierarchyPaging: Ember.computed('currentController.hierarchyPaging', function() {
    return this.get('currentController.hierarchyPaging');
  }),

  /**
    Flag indicate when available the collapse/expand all hierarchies mode.

    @property availableCollExpandMode
    @type Boolean
    @default false
    @private
  */
  availableCollExpandMode: false,

  /**
    Indent in pixels to indicate hierarchy.

    @property hierarchicalIndent
    @type Number
  */
  hierarchicalIndent: undefined,

  /**
    Using `ember-test-selectors`, creates `[data-test-component=flexberry-objectlistview]` selector for this component.

    @property data-test-component
    @type String
    @default 'flexberry-objectlistview'
  */
  'data-test-component': 'flexberry-objectlistview',

  /**
    Flag used to display filters in modal.

    @property showFiltersInModal
    @type Boolean
    @default false
  */
  showFiltersInModal: undefined,

  /**
    Path to component's settings in application configuration (JSON from ./config/environment.js).

    @property appConfigSettingsPath
    @type String
    @default 'APP.components.flexberryObjectlistview'
  */
  appConfigSettingsPath: 'APP.components.flexberryObjectlistview',

  /**
    Flag used for disable the hierarchical mode.

    @property disableHierarchicalMode
    @type Boolean
    @default false
  */
  disableHierarchicalMode: false,

  /**
    Default left padding in cells.

    @property defaultLeftPadding
    @type Number
    @default 10
  */
  defaultLeftPadding: 10,

  /**
    The passed pages as Ember array.

    @property _pages
    @type Ember.Array
  */
  _pages: Ember.computed('pages', function () {
    return Ember.A(this.get('pages'));
  }),

  /**
    Number page for search.

    @property searchPageValue
    @type Number
  */
  searchPageValue: undefined,

  /**
    Flag used for disabling searchPageButton.

    @property searchPageButtonReadonly
    @type Boolean
  */
  searchPageButtonReadonly: Ember.computed('searchPageValue', '_pages.@each.isCurrent', function() {
    const searchPageValue = this.get('searchPageValue');
    const searchPage = parseInt(searchPageValue, 10);
    if (isNaN(searchPage)) {
      return true;
    }

    const pages = this.get('_pages');
    const firstPage = pages.get('firstObject.number');
    const lastPage = pages.get('lastObject.number');
    const currentPage = pages.findBy('isCurrent').number;

    return searchPage < firstPage || searchPage > lastPage || searchPage === currentPage;
  }),

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
  Flag indicates whether to fix the table head (if `true`) or not (if `false`).

    @property fixedHeader
    @type Boolean
    @default false
  */
  fixedHeader: false,

  /**
    Route for edit form by click row.

    @property editFormRoute
    @type String
  */
  editFormRoute: undefined,

  /**
    Flag indicates whether component on edit form (for FOLV).

    @property onEditForm
    @type Boolean
    @default false
  */
  onEditForm: false,

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
    The name of the component. Initially, it was used to store user settings for the component. Now used for different purposes.

    @property componentName
    @type String
  */
  componentName: undefined,

  /**
    The name of the `flexberry-lookup` component for which the `flexberry-objectlistview` component is used.

    @property lookupComponentName
    @type String
  */
  lookupComponentName: undefined,

  /**
    Default cell component that will be used to display values in columns cells.

    @property {Object} cellComponent
    @property {String} [cellComponent.componentName=undefined]
    @property {String} [cellComponent.componentProperties=null]
  */
  cellComponent: {
    componentName: undefined,
    componentProperties: null,
  },

  /**
    Flag: indicates whether to show validation messages in every row or not.

    @property showValidationMessages
    @type Boolean
    @default false
  */
  showValidationMessagesInRow: false,

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
    Flag indicates whether to show edit button in first column of every row.

    @property showEditButtonInRow
    @type Boolean
    @default false
  */
  showEditButtonInRow: false,

  /**
    Flag indicates whether to show prototype button in first column of every row.

    @property showPrototypeButtonInRow
    @type Boolean
    @default false
  */
  showPrototypeButtonInRow: false,

  /**
    Flag indicates whether to show dropdown menu with delete menu item, in last column of every row.

    @property showDeleteMenuItemInRow
    @type Boolean
    @default false
  */
  showDeleteMenuItemInRow: false,

  /**
    Flag indicates whether to show dropdown menu with edit menu item, in last column of every row.

    @property showEditMenuItemInRow
    @type Boolean
    @default false
  */
  showEditMenuItemInRow: false,

  /**
    Flag indicates whether to show dropdown menu with prototype menu item, in last column of every row.

    @property showPrototypeMenuItemInRow
    @type Boolean
    @default false
  */
  showPrototypeMenuItemInRow: false,

  /**
    Additional menu items for dropdown menu in last column of every row.

    @example
      ```javascript
      // app/controllers/exapmle.js
      ...
      menuItems: [{
        icon: 'spy icon',
        title: 'Recruit it',
        actionName: 'recruit',
      }],
      ...
      actions: {
        ...
        recruit(record) {
          record.set('isSpy', true);
        },
        ...
      },
      ...
      ```

      Note: For every action in component you need to pass an additional parameter in the form of `actionName="actionName"`.
      ```javascript
      // app/templates/example.hbs
      ...
      {{flexberry-groupedit
        ...
        menuInRowAdditionalItems=menuItems
        recruit="recruit"
        ...
      }}
      ...
      ```

    For in-row menu following properties are used:
    - {{#crossLink "FlexberryGroupeditComponent/showEditMenuItemInRow:property"}}{{/crossLink}},
    - {{#crossLink "FlexberryGroupeditComponent/showPrototypeMenuItemInRow:property"}}{{/crossLink}},
    - {{#crossLink "FlexberryGroupeditComponent/showDeleteMenuItemInRow:property"}}{{/crossLink}},
    - {{#crossLink "FlexberryGroupeditComponent/menuInRowAdditionalItems:property"}}{{/crossLink}}.

    @property menuInRowAdditionalItems
    @type Array
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

    @property orderable
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
    Flag indicates whether to show colsConfigButton button at toolbar.

    @property colsConfigButton
    @type Boolean
    @default false
  */
  colsConfigButton: true,

  /**
    Flag indicates whether to show exportExcelButton button at toolbar.

    @property exportExcelButton
    @type Boolean
    @default false
  */
  exportExcelButton: false,

  /**
    Flag indicates whether to show button fo default sorting set.

    @property defaultSortingButton
    @type Boolean
    @default true
  */
  defaultSortingButton: true,

  /**
    Flag to use filters in OLV component.

    @property enableFilters
    @type Boolean
    @default false
  */
  enableFilters: false,

  /**
    The function (action) for setting the available filtering conditions, will be called when the component is initialized.

    The function must return a set of valid values for the `flexberry-dropdown` component and is called with two parameters:
    - `type` - string with the attribute type.
    - `attribute` - object with the attribute description.

    @property conditionsByType
    @type Function
  */
  conditionsByType: undefined,

  /**
    The function (action) to customize the component used in the filters, will be called when the component is initialized.

    The function must return an object with the following properties:
    - `name` - string with the component name.
    - `properties` object with the properties of the component, passed to the component via `dynamicProperties`.

    The function is called with three parameters:
    - `type` - string with the attribute type.
    - `relation` - indicates that the attribute is a relation.
    - `attribute` - object with the attribute description.

    @property componentForFilter
    @type Function
  */
  componentForFilter: undefined,

  /**
    The function (action) to customize the component used in the filters, will be called when the component is initialized and each time the condition is changed.

    The function must return an object with the following properties:
    - `name` - string with the component name.
    - `properties` object with the properties of the component, passed to the component via `dynamicProperties`.

    The function is called with three parameters:
    - `newCondition` - string with the new condition.
    - `oldCondition` - string with the old condition.
    - `type` - string with the attribute type.

    @property componentForFilterByCondition
    @type Function
  */
  componentForFilterByCondition: undefined,

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
    If this option is enabled, search query will be split by words, search will be on lines that contain any word of search query.

    @property filterByAnyWord
    @type Boolean
    @default false
  */
  filterByAnyWord: false,

  /**
    If this option is enabled, search query will be split by words, search will be on lines that contain each of search query word.

    @property filterByAllWords
    @type Boolean
    @default false
  */
  filterByAllWords: false,

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
    Total count records.

    @property recordsTotalCount
    @type Number
    @default null
  */
  recordsTotalCount: null,

  /**
    Minimum column width, if width isn't defined in userSettings.

    @property minAutoColumnWidth
    @type Number
    @default 150
  */
  minAutoColumnWidth: 150,

  /**
    Indicates whether or not autoresize columns for fit the page width.

    @property columnsWidthAutoresize
    @type Boolean
    @default false
  */
  columnsWidthAutoresize: false,

  /**
    List of component names, which can overflow table cell.

    @property overflowedComponents
    @type Array
    @default Ember.A(['flexberry-dropdown', 'flexberry-lookup'])
  */
  overflowedComponents: Ember.A(['flexberry-dropdown', 'flexberry-lookup']),

  /**
    Current interval of records.

    @property currentIntervalRecords
    @type String
    @readOnly
  */
  currentIntervalRecords: Ember.computed('pages', 'perPageValue', function() {
    let pages = this.get('pages');
    let perPageValue = this.get('perPageValue');
    let recordsTotalCount = this.get('recordsTotalCount');
    if (recordsTotalCount === null && this.get('showShowingEntries')) {
      this.set('showShowingEntries', false);
      throw new Error('Property \'recordsTotalCount\' is undefined.');
    }

    let currentStartRecords = null;
    let currentEndRecords = null;

    pages.forEach((page) => {
      if (page.isCurrent) {
        currentStartRecords = page.number * perPageValue - perPageValue + 1;
        currentEndRecords = page.number * perPageValue;
      }
    });

    if (currentEndRecords > recordsTotalCount) {
      currentEndRecords = recordsTotalCount;
    }

    return currentStartRecords + '-' + currentEndRecords;
  }),

  /**
    Flag indicates whether to show showingEntries.

    @property showShowingEntries
    @type Boolean
    @default true
  */
  showShowingEntries: true,

  /**
    Function to determine if current page has previous page.

    @property hasPreviousPage
    @type Function
    @default null
  */
  hasPreviousPage: null,

  /**
    Function to determine if current page has next page.

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

  /**
    Flag indicates whether row by row loading mode on.

    @property useRowByRowLoading
    @type Boolean
    @default true
  */
  useRowByRowLoading: true,

  /**
    Flag indicates whether to use bottom row by row loading progress while rows in loading state.

    @property useRowByRowLoadingProgress
    @type Boolean
    @default true
  */
  useRowByRowLoadingProgress: true,

  /**
    Interface for communication between object-list-view and flexberry-objectlistview.

    @property eventsBus
    @type Ember.Evented
  */
  eventsBus: Ember.Object.extend(Ember.Evented, {}).create(),

  /**
    Service that triggers objectlistview events.

    @property objectlistviewEventsService
    @type Service
  */
  objectlistviewEventsService: Ember.inject.service('objectlistview-events'),

  /**
    Array of custom user buttons.

    @example
      ```
      {
        buttonName: '...', // Button displayed name.
        buttonAction: '...', // Action that is called from controller on this button click (it has to be registered at component).
        buttonClasses: '...', // Css classes for button.
        buttonTitle: '...', // Button title.
        iconClasses: '', // Css classes for icon. Remember to add the `icon` class here, and for the `button` tag, through the `buttonClasses` property, if necessary.
        disabled: true, // The state of the button is disabled if `true` or enabled if `false`.
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
            buttonClasses: 'test-click-button'
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
  customButtons: undefined,

  /**
    Array of custom buttons of special structures [{ buttonName: ..., buttonAction: ..., buttonClasses: ... }, {...}, ...].

    @example
      ```
      {
        buttonName: '...', // Button displayed name.
        buttonAction: '...', // Action that is called from controller on this button click (it has to be registered at component).
        buttonClasses: '...', // Css classes for button.
        buttonIcon: '...', // Button icon
        buttonTitle: '...' // Button title.
      }
      ```

    @property customButtonsInRow
    @type Array
  */
  customButtonsInRow: undefined,

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
      @param {Object} record Clicked record.
      @param {Object} options Different parameters to handle action.
    */
    objectListViewRowClick(record, options) {
      if ((this.get('rowClickable') || options.rowEdit) && !this.get('readonly')) {
        let $clickedRow = this._getRowByKey(record.key || Ember.guidFor(record));
        runAfter(this, () => { return $clickedRow.hasClass('active'); }, () => {
          if (this.get('componentMode') === 'lookupform') {
            this.sendAction('action', record);
          } else {
            let editFormRoute = this.get('editFormRoute');
            Ember.assert('Edit form route must be defined for flexberry-objectlistview', editFormRoute);
            if (Ember.isNone(options)) {
              options = {};
              options.editFormRoute = editFormRoute;
            } else {
              options = Ember.merge(options, { editFormRoute: editFormRoute });
            }

            this.sendAction('action', record, options);
          }
        });

        this._setActiveRow($clickedRow);
      }
    },

    /**
      Handles action from object-list-view when no handler for this component is defined.

      @method actions.previousPage
      @public
      @param {Action} action Action previous page.
    */
    previousPage(action) {
      if (!action) {
        throw new Error('No handler for previousPage action set for flexberry-objectlistview. ' +
                        'Set handler like {{flexberry-objectlistview ... previousPage=(action "previousPage")}}.');
      }

      // TODO: when we will ask user about actions with selected records clearing selected records won't be use, because it resets selecting on other pages.
      this._clearSelectedRecords();

      action(this.get('componentName'));
    },

    /**
      Handles action from object-list-view when no handler for this component is defined.

      @method actions.nextPage
      @public
      @param {Action} action Action next page.
    */
    nextPage(action) {
      if (!action) {
        throw new Error('No handler for nextPage action set for flexberry-objectlistview. ' +
                      'Set handler like {{flexberry-objectlistview ... nextPage=(action "nextPage")}}.');
      }

      // TODO: when we will ask user about actions with selected records clearing selected records won't be use, because it resets selecting on other pages.
      this._clearSelectedRecords();

      action(this.get('componentName'));
    },

    /**
      Handles action from object-list-view when no handler for this component is defined.

      @method actions.gotoPage
      @public
      @param {Action} action Action go to page.
      @param {Number} pageNumber Number of page to go to.
    */
    gotoPage(action, pageNumber) {
      if (!action) {
        throw new Error('No handler for gotoPage action set for flexberry-objectlistview. ' +
                      'Set handler like {{flexberry-objectlistview ... gotoPage=(action "gotoPage")}}.');
      }

      // TODO: when we will ask user about actions with selected records clearing selected records won't be use, because it resets selecting on other pages.
      this._clearSelectedRecords();

      action(pageNumber, this.get('componentName'));
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
      Handler to get user button's in rows actions and send action to corresponding controllers's handler.

      @method actions.customButtonInRowAction
      @param {String} actionName The name of action.
      @param {DS.Model} model Model in row.
    */
    customButtonInRowAction(actionName, model) {
      if (!actionName) {
        throw new Error('No handler for custom button of flexberry-objectlistview row was found.');
      }

      this.sendAction(actionName, model);
    },

    /**
      This action is called when user click on menu in row.

      @method actions.createNewByPrototype
      @param {String|Number} prototypeId The prototype record ID in row.
      @public
    */
    createNewByPrototype(prototypeId) {
      Ember.assert('The prototype record ID is not defined', prototypeId);
      let editFormRoute = this.get('editFormRoute');
      Ember.assert('Property editFormRoute is not defined in controller', editFormRoute);
      let modelController = this.get('currentController');
      this.get('objectlistviewEventsService').setLoadingState('loading');
      let appController = Ember.getOwner(this).lookup('controller:application');
      let thisRouteName = appController.get('currentRouteName');
      let thisRecordId = modelController.get('model.id');
      let transitionOptions = {
        queryParams: {
          prototypeId: prototypeId,
          parentParameters: {
            parentRoute: thisRouteName,
            parentRouteRecordId: thisRecordId
          }
        }
      };

      Ember.run.later((function() {
        modelController.transitionToRoute(editFormRoute + '.new', transitionOptions);
      }), 50);
    },

    /**
      Show/hide filters.

      @method actions.toggleStateFilters
    */
    toggleStateFilters() {
      this.toggleProperty('_showFilters');
    },

    /**
      Dummy action handlers, overloaded in {{#crossLink "LimitedController"}}{{/crossLink}}.

      @method actions.applyFilters
      @param {Array} filters Filters.
    */
    applyFilters(filters) {
      throw new Error('No handler for applyFilters action set for flexberry-objectlistview. ' +
                      'Set handler like {{flexberry-objectlistview ... applyFilters=(action "applyFilters")}}.');
    },

    /**
      Dummy action handlers, overloaded in {{#crossLink "LimitedController"}}{{/crossLink}}.

      @method actions.resetFilters
      @param {Action} action Action reset filters.
    */
    resetFilters(action) {
      if (!action) {
        throw new Error('No handler for resetFilters action set for flexberry-objectlistview. ' +
                      'Set handler like {{flexberry-objectlistview ... resetFilters=(action "resetFilters")}}.');
      }

      action(this.get('componentName'));
    },

    /**
      Handles action from object-list-view when no handler for this component is defined.

      @method actions.filterByAnyMatch
      @param {String} The pattern to filter objects
    */
    filterByAnyMatch(pattern) {
      throw new Error('No handler for filterByAnyMatch action set for flexberry-objectlistview. ' +
                      'Set handler like {{flexberry-objectlistview ... filterByAnyMatch=(action "filterByAnyMatch")}}.');
    },

    /**
      Set availability hierarchical mode, and save the attribute name in controller.

      @method actions.availableHierarchicalMode
      @param {String} hierarchicalAttribute Attribute name to hierarchy building.
    */
    availableHierarchicalMode(hierarchicalAttribute) {
      this.toggleProperty('_availableHierarchicalMode');
      this.sendAction('_saveHierarchicalAttribute', hierarchicalAttribute, false, this.get('componentName'));
    },

    /**
      Called controller action to switch in hierarchical mode.

      @method actions.switchHierarchicalMode
    */
    switchHierarchicalMode() {
      this.sendAction('_switchHierarchicalMode', this.get('componentName'));
    },

    /**
      Called controller action to switch in collapse/expand mode.

      @method actions.switchExpandMode
    */
    switchExpandMode() {
      this.sendAction('_switchExpandMode', this.get('componentName'));
    },

    /**
      Redirects the call to controller.

      @method actions.loadRecords
      @param {String} Primary key.
      @param {ObjectListViewRowComponent} Instance of {{#crossLink "ObjectListViewRowComponent"}}{{/crossLink}}.
      @param {String} Property name.
      @param {Boolean} Flag indicates that this is the first download of data.
    */
    loadRecords(id, target, property, firstRunMode) {
      this.sendAction('_loadRecords', id, target, property, firstRunMode, this.get('componentName'));
    },

    /**
      Called when click on perPage.

      @method actions.perPageClick
      @param {String} perPageValue Selected perPage value.
    */
    perPageClick(perPageValue) {
      var userSettings = this.get('userSettingsService');
      if (parseInt(perPageValue, 10) !== userSettings.getCurrentPerPage(this.componentName)) {
        userSettings.setCurrentPerPage(this.componentName, undefined, perPageValue);
      }
    },

    /**
      Send action with `actionName` into controller.

      @method actions.sendMenuItemAction
      @param {String} actionName
      @param {DS.Model} record
    */
    sendMenuItemAction(actionName, record) {
      this.sendAction(actionName, record);
    },

    /**
      Action search and open page.

      @method actions.searchPageButtonAction
      @param {Function} action The `goToPage` action from controller.
    */
    searchPageButtonAction(action) {
      let searchPageValue = this.get('searchPageValue');
      let searchPageNumber = parseInt(searchPageValue, 10);

      if (searchPageNumber) {
        this.send('gotoPage', action, searchPageNumber);
      }
    }
  },

  /**
    Hook that can be used to confirm delete row.

    @example
      ```javascript
      // app/controllers/example.js
      ...
      actions: {
        ...
        confirmDeleteRow(record) {
          return new Promise((resolve, reject) => {
            this.showConfirmDialg({
              title: `Delete an object with the ID '${record.get('id')}'?`,
              onApprove: resolve,
              onDeny: reject,
            });
          });
        }
        ...
      }
      ...
      ```

      ```handlebars
      <!-- app/templates/example.hbs -->
      {{flexberry-objectlistview
        ...
        confirmDeleteRow=(action "confirmDeleteRow")
        ...
      }}
      ```

    @method confirmDeleteRow
    @param {DS.Model} record The record to be deleted.
    @return {Boolean|Promise} If `true`, then delete row, if `Promise`, then delete row after successful resolve, else cancel.
  */
  confirmDeleteRow: undefined,

  /**
    Hook that can be used to confirm delete rows.

    @example
      ```javascript
      // app/controllers/example.js
      ...
      actions: {
        ...
        confirmDeleteRows() {
          return new Promise((resolve, reject) => {
            this.showConfirmDialg({
              title: 'Delete all selected records?',
              onApprove: resolve,
              onDeny: reject,
            });
          });
        }
        ...
      }
      ...
      ```

      ```handlebars
      <!-- app/templates/example.hbs -->
      {{flexberry-objectlistview
        ...
        confirmDeleteRows=(action "confirmDeleteRows")
        ...
      }}
      ```

    @method confirmDeleteRows
    @return {Boolean|Promise} If `true`, then delete row, if `Promise`, then delete row after successful resolve, else cancel.
  */
  confirmDeleteRows: undefined,

  /**
    Hook that executes before deleting the record.

    @example
      ```handlebars
      <!-- app/templates/employees.hbs -->
      {{flexberry-objectlistview
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

  /**
    Hook that executes before deleting all records on all pages.

    @example
      ```handlebars
      <!-- app/templates/employees.hbs -->
      {{flexberry-objectlistview
        ...
        beforeDeleteAllRecords=(action 'beforeDeleteAllRecords')
        ...
      }}
      ```

      ```javascript
      // app/controllers/employees.js
      import ListFormController from './list-form';

      export default ListFormController.extend({
        actions: {
          beforeDeleteAllRecords(modelName, data) {
            if (modelName === 'application-user') {
              data.cancel = true;
            }
          }
        }
      });
      ```

    @method beforeDeleteAllRecords
    @param {String} modelName Model name for deleting records.
    @param {Object} data Metadata.
    @param {Boolean} [data.cancel=false] Flag for canceling deletion.
    @param {Object} [data.filterQuery] Filter applying before delete all records on all pages.
  */
  beforeDeleteAllRecords: undefined,

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

    let eventsBus = this.get('eventsBus');
    if (eventsBus) {
      eventsBus.on('setMenuWidth', (componentName, tableWidth, containerWidth) => {
        if (componentName === this.get('componentName') && (!this.get('inHierarchicalMode') || this.get('hierarchyPaging'))) {
          this._setMenuWidth(tableWidth, containerWidth);
        }
      });
    }

    // Initialize properties which defaults could be defined in application configuration.
    this.initProperty({ propertyName: 'showFiltersInModal', defaultValue: false });
  },

  /**
    Called after a component has been rendered, both on initial render and in subsequent rerenders.
    [More info](http://emberjs.com/api/classes/Ember.Component.html#event_didRender).

    @method didRender
  */
  didRender() {
    this._super(...arguments);
    this.get('formLoadTimeTracker').set('endRenderTime', performance.now());
  },

  /**
    Called when the element of the view is going to be destroyed.
    For more information see [willDestroyElement](http://emberjs.com/api/classes/Ember.Component.html#event_willDestroyElement) event of [Ember.Component](http://emberjs.com/api/classes/Ember.Component.html).
  */
  willDestroyElement() {
    this._super(...arguments);

    let eventsBus = this.get('eventsBus');
    if (eventsBus) {
      eventsBus.off('setMenuWidth');
    }
  },

  /**
    Get the row by key.

    @method _getRowByKey
    @private
  */
  _getRowByKey(key) {
    let row = null;
    this.$('tbody tr').each(function() {
      let currentKey = Ember.$(this).find('td:eq(0) div:eq(0)').text().trim();
      if (currentKey === key) {
        row = Ember.$(this);
        return;
      }
    });
    return row;
  },

  /**
    Set the active row.

    @method _setActiveRow
    @private

    @param {Object} row Table row, which must become active.
  */
  _setActiveRow($row) {
    // Deactivate previously activated row.
    this.$('tbody tr.active').removeClass('active');

    // Activate specified row.
    if ($row && $row.addClass) {
      $row.addClass('active');
    }
  },

  _setMenuWidth(tableWidth, containerWidth) {
    let $table = this.$('table.object-list-view');
    if (Ember.isBlank(tableWidth)) {
      tableWidth = $table.width();
    }

    if (Ember.isBlank(containerWidth)) {
      containerWidth = $table.parent().width() - 5;
    }

    // Using scrollWidth, because Internet Explorer don't receive correct value for this element with .width().
    let pages = this.$('.ui.secondary.menu .ui.basic.buttons')[0];
    if (tableWidth < pages.scrollWidth) {
      tableWidth = pages.scrollWidth + 75;
    }

    this.$('.ui.secondary.menu').css({ 'width': (this.get('columnsWidthAutoresize') ?
      containerWidth : containerWidth < tableWidth ? containerWidth : tableWidth) + 'px' });
  },

  /**
    Clear selected records on all pages.
    This method should be removed when we will ask user about actions with selected records.

    @method _clearSelectedRecords
    @private
  */
  _clearSelectedRecords() {
    let componentName = this.get('componentName');
    this.get('objectlistviewEventsService').clearSelectedRecords(componentName);
  },
});
