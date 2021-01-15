/**
  @module ember-flexberry
*/
import Ember from 'ember';
import { translationMacro as t } from 'ember-i18n';
import { getValueFromLocales } from 'ember-flexberry-data/utils/model-functions';
import generateUniqueId from 'ember-flexberry-data/utils/generate-unique-id';
import getAttrLocaleKey from '../utils/get-attr-locale-key';

import FlexberryBaseComponent from './flexberry-base-component';
import FlexberryLookupCompatibleComponentMixin from '../mixins/flexberry-lookup-compatible-component';
import FlexberryFileCompatibleComponentMixin from '../mixins/flexberry-file-compatible-component';
import getProjectionByName from '../utils/get-projection-by-name';
import runAfter from '../utils/run-after';

/**
  Object list view component.

  @class ObjectListViewComponent
  @extends FlexberryBaseComponent
  @uses FlexberryLookupCompatibleComponentMixin
  @uses FlexberryLookupCompatibleComponentMixin
  @uses ErrorableControllerMixin
*/
export default FlexberryBaseComponent.extend(
  FlexberryLookupCompatibleComponentMixin,
  FlexberryFileCompatibleComponentMixin, {
  /**
    Projection set by property {{#crossLink "ObjectListViewComponent/modelProjection:property"}}{{/crossLink}}.

    @property _modelProjection
    @type Object
    @default null
    @private
  */
  _modelProjection: null,

  _contentObserver: Ember.on('init', Ember.observer('content', function() {
    this._setContent(this.get('componentName'));

    if (this.get('allSelect')) {
      let contentWithKeys = this.get('contentWithKeys');
      let checked = this.get('allSelect');

      contentWithKeys.forEach((item) => {
        item.set('selected', checked);
        item.set('rowConfig.canBeSelected', !checked);
      });
    }
  })),

  sortTitle: t('components.object-list-view.header-title-attr'),

  /**
    Title for table headers.

    @property sortTitleCompute
    @type String
  */
  sortTitleCompute: Ember.computed('orderable', 'sortTitle', function() {
    if (this.get('orderable')) {
      return this.get('sortTitle');
    } else {
      return '';
    }
  }),

  /**
    Flag indicates on availability in view order property.

    @property orderedProperty
    @type String
  */
  orderedProperty: undefined,

  /**
    Model projection which should be used to display given content.
    Accepts object or name projections.

    @property modelProjection
    @type Object|String
    @default null
  */
  modelProjection: Ember.computed('_modelProjection', {
    get(key) {
      return this.get('_modelProjection');
    },
    set(key, value) {
      if (typeof value === 'string') {
        let projectionName = value;
        let modelName = this.get('modelName');
        value = getProjectionByName(projectionName, modelName, this.get('store'));
        Ember.assert(`Projection with name '${projectionName}' for model with name '${modelName}' is not found.`, value);
      } else if (typeof value !== 'object') {
        throw new Error(`Property 'modelProjection' should be a string or object.`);
      }

      this.set('_modelProjection', value);
      return value;
    },
  }),

  /**
    Main model projection. Accepts object projections.
    Needs for support locales of captions.

    @property mainModelProjection
    @type Object
  */
  mainModelProjection: undefined,

  /**
    Default classes for component wrapper.
  */
  classNames: ['object-list-view-container'],

  /**
    Table row click action name.

    @property action
    @type String
    @default ''
    @readOnly
  */
  action: '',

  /**
    Flag indicates whether allow to resize columns (if `true`) or not (if `false`).

    @property allowColumnResize
    @type Boolean
    @default true
  */
  allowColumnResize: true,

  /**
    Flag indicates whether to fix the table head (if `true`) or not (if `false`).

    @property fixedHeader
    @type Boolean
    @default true
  */
  fixedHeader: false,

  /**
    Table add column to sorting action name.

    @property addColumnToSorting
    @type String
    @default 'addColumnToSorting'
    @readOnly
  */
  addColumnToSorting: 'addColumnToSorting',

  /**
    Table sort by column action name.

    @property sortByColumn
    @type String
    @default 'sortByColumn'
    @readOnly
  */
  sortByColumn: 'sortByColumn',

  /**
    Default left padding in cells.

    @property defaultLeftPadding
    @type Number
    @default 10
  */
  defaultLeftPadding: 10,

  defaultPaddingStyle: Ember.computed('defaultLeftPadding', function() {
    let defaultLeftPadding = this.get('defaultLeftPadding');
    return Ember.String.htmlSafe(`padding-left:${defaultLeftPadding}px !important; padding-right:${defaultLeftPadding}px !important;`);
  }),

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
    Flag indicates whether component on edit form (for FOLV).

    @property onEditForm
    @type Boolean
    @default false
  */
  onEditForm: false,

  /**
    Custom classes for table.

    @example
      ```handlebars
      <!-- app/templates/employees.hbs -->
      {{flexberry-objectlistview
        ...
        customTableClass="inverted blue"
        ...
      }}
      ```
    @property customTableClass
    @type String
    @default ''
  */
  customTableClass: '',

  /**
    The flag is selected for all records.

    @property allSelect
    @type Boolean
    @default false
  */
  allSelect: false,

  /**
    Classes for table.

    @property tableClass
    @type String
    @readOnly
  */
  tableClass: Ember.computed('tableStriped', 'rowClickable', 'customTableClass', 'allowColumnResize', function() {
    let tableStriped = this.get('tableStriped');
    let rowClickable = this.get('rowClickable');
    let allowColumnResize = this.get('allowColumnResize');
    let classes = this.get('customTableClass');

    if (tableStriped) {
      classes += ' striped';
    }

    if (rowClickable) {
      classes += ' selectable';
    }

    if (allowColumnResize) {
      classes += ' fixed JColResizer';
    }

    return classes;
  }),

  /**
    Path to component's settings in application configuration (JSON from ./config/environment.js).

    @property appConfigSettingsPath
    @type String
    @default 'APP.components.objectListView'
  */
  appConfigSettingsPath: 'APP.components.objectListView',

  /**
    Default cell component that will be used to display values in columns cells.

    @property {Object} cellComponent
    @property {String} [cellComponent.componentName='object-list-view-cell']
    @property {String} [cellComponent.componentProperties=null]
  */
  cellComponent: {
    componentName: undefined,
    componentProperties: null,
  },

  /**
    Custom data for the editform

    @property {Object} customParameters
  */
  customParameters: {},

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
    Flag indicates whether to not use userSetting from backend
    @property notUseUserSettings
    @type Boolean
    @default false
  */
  notUseUserSettings: false,

  /**
    Flag indicates whether to show helper column or not.

    @property showHelperColumn
    @type Boolean
    @readOnly
  */
  showHelperColumn: Ember.computed(
    'showAsteriskInRow',
    'showCheckBoxInRow',
    'showEditButtonInRow',
    'showPrototypeButtonInRow',
    'showDeleteButtonInRow',
    'customButtonsInRow',
    'modelProjection',
    function() {
      if (this.get('modelProjection')) {
        return this.get('showAsteriskInRow') ||
          this.get('showCheckBoxInRow') ||
          this.get('showEditButtonInRow') ||
          this.get('showPrototypeButtonInRow') ||
          this.get('showDeleteButtonInRow') ||
          !!this.get('customButtonsInRow');
      } else {
        return false;
      }
    }
  ).readOnly(),

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
    Flag used to display filters in modal.

    @property showFiltersInModal
    @type Boolean
    @default false
  */
  showFiltersInModal: false,

  /**
    Flag indicates whether to show dropdown menu with prototype menu item, in last column of every row.

    @property showPrototypeMenuItemInRow
    @type Boolean
    @default false
  */
  showPrototypeMenuItemInRow: false,

  /**
    Additional menu items for dropdown menu in last column of every row.

    @property menuInRowAdditionalItems
    @type Boolean
    @default null
  */
  menuInRowAdditionalItems: null,

  /**
    Flag indicates whether additional menu items for dropdown menu in last column of every row are defined.

    @property menuInRowHasAdditionalItems
    @type Boolean
    @readOnly
  */
  menuInRowHasAdditionalItems: Ember.computed('menuInRowAdditionalItems.[]', function() {
    let menuInRowAdditionalItems = this.get('menuInRowAdditionalItems');
    return Ember.isArray(menuInRowAdditionalItems) && menuInRowAdditionalItems.length > 0;
  }),

  /**
    Flag indicates whether to show menu column or not.

    @property showMenuColumn
    @type Boolean
    @readOnly
  */
  showMenuColumn: Ember.computed(
    'showEditMenuItemInRow',
    'showPrototypeMenuItemInRow',
    'showDeleteMenuItemInRow',
    'menuInRowHasAdditionalItems',
    function() {
      return (
        this.get('showEditMenuItemInRow') ||
        this.get('showPrototypeMenuItemInRow') ||
        this.get('showDeleteMenuItemInRow') ||
        this.get('menuInRowHasAdditionalItems')
      );
    }
  ),

  /**
    Table columns related to current model projection.

    @property columns
    @type Object[]
    @readOnly
  */
  columns: Ember.computed('modelProjection', 'enableFilters', 'content', function() {
    let ret;
    let projection = this.get('modelProjection');

    if (!projection) {
      return Ember.A();
    }

    let cols = this._generateColumns(projection.attributes);
    let userSettings;
    if (this.notUseUserSettings === true) {

      // flexberry-groupedit and lookup-dialog-content set this flag to true and use only developerUserSettings.
      // In future release backend can save userSettings for each olv.
      userSettings = this.get('currentController.developerUserSettings');
      userSettings = userSettings ? userSettings[this.get('componentName')] : undefined;
      userSettings = userSettings ? userSettings.DEFAULT : undefined;
    } else {
      userSettings = this.get('userSettingsService').getCurrentUserSetting(this.get('componentName')); // TODO: Need use promise for loading user settings. There are async promise execution now, called by hook model in list-view route (loading started by call setDeveloperUserSettings(developerUserSettings) but may be not finished yet).
    }

    if (Ember.isNone(userSettings) || Ember.isEmpty(Object.keys(userSettings))) {
      const userSettingValue = Ember.getOwner(this).lookup('default-user-setting:' + this.get('modelName'));
      if (!Ember.isNone(userSettingValue)) {
        userSettings = userSettingValue.DEFAULT
      }
    }

    let onEditForm = this.get('onEditForm');

    // TODO: add userSettings support on edit form.
    if (userSettings && !onEditForm) {
      let namedCols = {};
      for (let i = 0; i < cols.length; i++) {
        let col = cols[i];
        delete col.sorted;
        delete col.sortNumber;
        delete col.sortAscending;
        delete col.width;
        let propName = col.propName;
        namedCols[propName] = col;
      }

      // Set columns width.
      if (Ember.isArray(userSettings.columnWidths)) {
        for (let i = 0; i < userSettings.columnWidths.length; i++) {
          let columnWidth = userSettings.columnWidths[i];
          if (namedCols[columnWidth.propName]) {
            namedCols[columnWidth.propName].width = columnWidth.width || 150;
          }
        }
      }

      if (userSettings.sorting === undefined) {
        userSettings.sorting = [];
      }

      if (Ember.isNone(this.get('orderedProperty'))) {
        for (let i = 0; i < userSettings.sorting.length; i++) {
          let sorting = userSettings.sorting[i];
          if (namedCols[sorting.propName]) {
            namedCols[sorting.propName].sorted = true;
            namedCols[sorting.propName].sortAscending = sorting.direction === 'asc' ? true : false;
            namedCols[sorting.propName].sortNumber = i + 1;
          }
        }
      }

      if (userSettings.colsOrder !== undefined) {
        ret = [];
        for (let i = 0; i < userSettings.colsOrder.length; i++) {
          let userSetting = userSettings.colsOrder[i];
          if (!userSetting.hide && namedCols[userSetting.propName]) {
            ret[ret.length] = namedCols[userSetting.propName];
          }
        }
      } else {
        if (this.currentController) {
          if (this.currentController.userSettings === undefined) {
            Ember.set(this.currentController, 'userSettings', {});
          }

          Ember.set(this.currentController.userSettings, 'colsOrder', cols);
        }

        ret = cols;
      }
    } else {
      if (this.currentController) {
        if (this.currentController.userSettings === undefined) {
          Ember.set(this.currentController, 'userSettings', {});
        }

        Ember.set(this.currentController.userSettings, 'colsOrder', cols);
      }

      ret = cols;
    }

    this.get('objectlistviewEventsService').setOlvFilterColumnsArray(this.get('componentName'), ret);
    return ret;
  }),

  /**
    Total columns count (including additional columns).

    @property colspan
    @type Number
    @readOnly
  */
  colspan: Ember.computed('columns.length', 'showHelperColumn', 'showMenuColumn', function() {
    let columnsCount = 0;
    if (this.get('showHelperColumn')) {
      columnsCount += 1;
    }

    if (this.get('showMenuColumn')) {
      columnsCount += 1;
    }

    let columns = this.get('columns');
    columnsCount += Ember.isArray(columns) ? columns.length : 0;

    return columnsCount;
  }),

  /**
    Flag indicates whether some column contains editable component instead of default cellComponent.
    Don't work if change `componentName` inside `cellComponent`.

    @property hasEditableValues
    @type Boolean
    @readOnly
  */
  hasEditableValues: Ember.computed('columns.[]', 'columns.@each.cellComponent', function() {
    let columns = this.get('columns');
    if (!Ember.isArray(columns)) {
      return true;
    }

    let defaultCellCompoinentName = this.get('cellComponent.componentName');
    return columns.filter(function(column) {
      return column.cellComponent.componentName !== defaultCellCompoinentName;
    }).length > 0;
  }),

  /**
    Content to be displayed (models collection).

    @property content
    @type DS.ManyArray
    @default null
  */
  content: null,

  /**
    Array of models from content collection with some synthetic keys related to them.

    @property contentWithKeys
    @type Object[]
    @default null
  */
  contentWithKeys: null,

  contentForRender: null,

  /**
    Flag indicates whether row by row loading mode on.

    @property useRowByRowLoading
    @type Boolean
    @default false
  */
  useRowByRowLoading: false,

  /**
    Flag indicates whether to show row by row loading in progress.

    @property rowByRowLoadingProgress
    @type Boolean
    @default false
  */
  rowByRowLoadingProgress: false,

  /**
    Flag indicates whether to use bottom row by row loading progress while rows in loading state.

    @property useRowByRowLoadingProgress
    @type Boolean
    @default false
  */
  useRowByRowLoadingProgress: false,

  /**
    Flag indicates whether content is defined.

    @property hasContent
    @type Boolean
    @readOnly
  */
  hasContent: Ember.computed('contentWithKeys.length', function() {
    return this.get('contentWithKeys.length') > 0;
  }),

  /**
    Text to be displayed in table body, if content is not defined or empty.

    @property placeholder
    @type String
    @default 't('components.object-list-view.placeholder')'
  */
  placeholder: t('components.object-list-view.placeholder'),

  /**
    Flag indicates whether table headers are clickable.

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
    Last selected record.

    @property selectedRecord
    @type DS.Model
    @default null
  */
  selectedRecord: null,

  /**
    All selected records.

    @property selectedRecords
    @type DS.Model[]
    @default null
  */
  selectedRecords: null,

  /**
    Custom attributes which will be added to each generated column.

    @property customColumnAttributes
    @type Object
    @default null
  */
  customColumnAttributes: null,

  /**
    Filter setting.

    @property filterByAnyMatch
    @type String
    @default 'filterByAnyMatch'
  */
  filterByAnyMatch: 'filterByAnyMatch',

  /**
    Hook for configurate rows.

    @example
      ```handlebars
      <!-- app/templates/employees.hbs -->
      {{flexberry-objectlistview
        ...
        configurateRow=(action "configurateRow")
        ...
      }}
      ```

      ```js
      // app/controllers/employees.js
      import ListFormController from './list-form';

      export default ListFormController.extend({
        actions: {
          configurateRow(rowConfig, record) {
            Ember.set(rowConfig, 'canBeDeleted', false);
            if (record.get('isMyFavoriteRecord')) {
              Ember.set(rowConfig, 'customClass', 'my-fav-record');
            }

            let readonlyColumns = [];
            if (record.get('isNameColumnReadonly')) {
              readonlyColumns.push('name');
            }

            Ember.set(rowConfig, 'readonlyColumns', readonlyColumns);
          }
        }
      });
      ```
    @method configurateRow

    @param {Object} rowConfig Settings for row.
                            See {{#crossLink "ObjectListView/defaultRowConfig:property"}}{{/crossLink}}
                            property for details
    @param {DS.Model} record The record in row.
  */
  configurateRow: undefined,

  /**
    Hook for configurate selected rows.

    @example
      ```handlebars
      <!-- app/templates/employees.hbs -->
      {{flexberry-objectlistview
        ...
        configurateSelectedRows=(action "configurateSelectedRows")
        ...
      }}
      ```

      ```js
      // app/controllers/employees.js
      import ListFormController from './list-form';

      export default ListFormController.extend({
        actions: {
          configurateSelectedRows(selectedRecords) {
            // do something
          }
        }
      });
      ```
    @method configurateSelectedRows

    @param {DS.Model[]} selectedRecords All selected records.
  */
  configurateSelectedRows: undefined,

  selectedRowsChanged: Ember.on('init', Ember.observer('selectedRecords.@each', function() {
    let selectedRecords = this.get('selectedRecords');
    let configurateSelectedRows = this.get('configurateSelectedRows');
    if (configurateSelectedRows) {
      Ember.assert('configurateSelectedRows must be a function', typeof configurateSelectedRows === 'function');
      configurateSelectedRows(selectedRecords);
    }
  })),

  /**
    Default settings for rows.

    @property defaultRowConfig
    @type Object

    @param {Boolean} [canBeDeleted=true] The row can be deleted
    @param {Boolean} [canBeSelected=true] The row can be selected via checkbox
    @param {String} [customClass=''] Custom css classes for the row
  */
  defaultRowConfig: {
    canBeDeleted: true,
    canBeSelected: true,
    customClass: '',
  },

  /**
    Flag indicates whether DELETE request should be immediately sended to server (on each deleted record) or not.

    @property immediateDelete
    @type Boolean
    @default false
  */
  immediateDelete: false,

  /**
    Flag indicates whether records should be edited on separate route.

    @property editOnSeparateRoute
    @type Object
    @default false
  */
  editOnSeparateRoute: false,

  /**
    Flag indicates whether to save current model before going to the detail's route.

    @property saveBeforeRouteLeave
    @type Boolean
    @default false
  */
  saveBeforeRouteLeave: false,

  /**
    Ember data store.

    @property store
    @type Service
  */
  store: Ember.inject.service('store'),

  /**
    Service that triggers objectlistview events.

    @property objectlistviewEventsService
    @type Service
  */
  objectlistviewEventsService: Ember.inject.service('objectlistview-events'),

  /**
    Service for managing the state of the application.

    @property appState
    @type AppStateService
  */
  appState: Ember.inject.service(),

  /**
    Used to identify objectListView on the page.

    @property componentName
    @type String
    @default ''
  */
  componentName: '',

  actions: {
    /**
      Just redirects action up to {{#crossLink "FlexberryObjectlistviewComponent"}}`flexberry-objectlistview`{{/crossLink}} component.

      @method actions.customButtonInRowAction
      @param {String} actionName The name of action.
      @param {DS.Model} model Model in row.
    */
    customButtonInRowAction(actionName, model) {
      this.sendAction('customButtonInRowAction', actionName, model);
    },

    /**
      This action is called when user click on row.

      @method actions.rowClick
      @public
      @param {Object} recordWithKey Object containing record related to clicked row and it's key.
      @param {Object} recordWithKey.key Key of record related to clicked row
      @param {Object} recordWithKey.data Record related to clicked row.
      @param {Object} params Additional parameters describing clicked row.
      @param {Object} params.column Column in row wich owns the clicked cell.
      @param {Number} params.columnIndex Index of column in row wich owns the clicked cell.
      @param {jQuery.Event} params.originalEvent Сlick event object.
    */
    rowClick(recordWithKey, params) {
      let editOnSeparateRoute = this.get('editOnSeparateRoute');
      if (this.get('readonly')) {
        if (!editOnSeparateRoute) {
          return;
        }
      }

      if (this.rowClickable || params.rowEdit) {
        let recordKey = recordWithKey && recordWithKey.key;
        let recordData = recordWithKey && recordWithKey.data;
        let recordModelName = Ember.isNone(recordData) ? undefined : recordData.constructor.modelName;

        let $selectedRow = this._getRowByKey(recordKey);
        let editOnSeparateRoute = this.get('editOnSeparateRoute');
        params = params || {};
        Ember.$.extend(params, {
          onEditForm: this.get('onEditForm'),
          saveBeforeRouteLeave: this.get('saveBeforeRouteLeave'),
          editOnSeparateRoute: editOnSeparateRoute,
          modelName: recordModelName || this.get('modelProjection').modelName,
          detailArray: this.get('content'),
          readonly: this.get('readonly'),
          goToEditForm: true,
          customParameters: this.get('customParameters')
        });

        runAfter(this, () => { return Ember.isNone($selectedRow) || $selectedRow.hasClass('active'); }, () => {
          this.sendAction('action', recordData, params);
        });

        this._setActiveRecord(recordKey);

        if (!editOnSeparateRoute) {
          // It is necessary only when we will not go to other route on click.
          this.set('selectedRecord', recordData);
        }
      }
    },

    /**
      This action is called when user click on header.

      @method actions.headerCellClick
      @public
      @param {Object} column
      @param {jQuery.Event} e jQuery.Event by click on column.
    */
    headerCellClick(column, e) {
      if (!this.orderable || column.sortable === false || !Ember.isNone(this.get('orderedProperty'))) {
        return;
      }

      let action = e.ctrlKey ? 'addColumnToSorting' : 'sortByColumn';
      this.sendAction(action, column, this.get('componentName'));
    },

    /**
      This action is called when user click on menu in row.

      @method actions.deleteRow
      @public
      @param {DS.Model} recordWithKey A record with key
      @param {jQuery.Event} e jQuery.Event by click on row
    */
    deleteRow(recordWithKey, e) {

      // TODO: rename recordWithKey. rename record in the template, where it is actually recordWithKey.
      if (this.get('readonly') || !recordWithKey.rowConfig.canBeDeleted) {
        return;
      }

      let confirmDeleteRow = this.get('confirmDeleteRow');
      let possiblePromise = null;

      if (confirmDeleteRow) {
        Ember.assert('Error: confirmDeleteRow must be a function.', typeof confirmDeleteRow === 'function');

        possiblePromise = confirmDeleteRow(recordWithKey.data);

        if ((!possiblePromise || !(possiblePromise instanceof Ember.RSVP.Promise))) {
          return;
        }
      }

      if (possiblePromise || (possiblePromise instanceof Ember.RSVP.Promise)) {
        possiblePromise.then(() => {
          this._deleteRecord(recordWithKey.data, this.get('immediateDelete'));
        });
      } else {
        this._deleteRecord(recordWithKey.data, this.get('immediateDelete'));
      }
    },

    /**
      This action is called when user select the row.

      @method actions.selectRow
      @public
      @param {DS.Model} recordWithKey A record with key
      @param {jQuery.Event} e jQuery.Event by click on row
    */
    selectRow(recordWithKey, e) {
      let selectedRecords = this.get('selectedRecords');
      let selectedRow = this._getRowByKey(recordWithKey.key);

      if (e.checked) {
        if (!selectedRow.hasClass('active')) {
          selectedRow.addClass('active');
        }

        if (selectedRecords.indexOf(recordWithKey.data) === -1) {
          selectedRecords.pushObject(recordWithKey.data);
        }
      } else {
        if (selectedRow.hasClass('active')) {
          selectedRow.removeClass('active');
        }

        selectedRecords.removeObject(recordWithKey.data);
      }

      let componentName = this.get('componentName');
      this.get('objectlistviewEventsService').rowSelectedTrigger(componentName, recordWithKey.data, selectedRecords.length, e.checked, recordWithKey);
    },

    /**
      This action is called when click check all at page button.

      @method actions.checkAllAtPage
      @public
      @param {jQuery.Event} e jQuery.Event by click on check all at page button
    */
    checkAllAtPage(e) {
      if (this.get('allSelect')) {
        return;
      }

      let contentWithKeys = this.get('contentWithKeys');
      let selectedRecords = this.get('selectedRecords');

      let checked = false;

      for (let i = 0; i < contentWithKeys.length; i++) {
        if (!contentWithKeys[i].get('selected')) {
          checked = true;
        }
      }

      for (let i = 0; i < contentWithKeys.length; i++) {
        let recordWithKey = contentWithKeys[i];
        let selectedRow = this._getRowByKey(recordWithKey.key);

        if (checked) {
          if (!selectedRow.hasClass('active')) {
            selectedRow.addClass('active');
          }

          if (selectedRecords.indexOf(recordWithKey.data) === -1) {
            selectedRecords.pushObject(recordWithKey.data);
          }
        } else {
          if (selectedRow.hasClass('active')) {
            selectedRow.removeClass('active');
          }

          selectedRecords.removeObject(recordWithKey.data);
        }

        recordWithKey.set('selected', checked);

        let componentName = this.get('componentName');
        this.get('objectlistviewEventsService').rowSelectedTrigger(componentName, recordWithKey.data, selectedRecords.length, checked, recordWithKey);
      }
    },

    /**
      This action is called when click check all at all button.

      @method actions.checkAll
      @public
      @param {jQuery.Event} e jQuery.Event by click on ckeck all button
    */
    checkAll(e) {
      let checked = !this.get('allSelect');

      let componentName = this.get('componentName');
      this.get('objectlistviewEventsService').updateSelectAllTrigger(componentName, checked, true);
      this.selectedRowsChanged();
    },

    /**
      Handler click on flexberry-menu.

      @method actions.onCheckRowMenuItemClick
      @param {jQuery.Event} e jQuery.Event by click on menu item
    */
    onCheckRowMenuItemClick(e) {
      let namedItemSpans = Ember.$(e.currentTarget).find('span');
      if (namedItemSpans.length <= 0) {
        return;
      }

      let i18n = this.get('i18n');
      let namedSetting = namedItemSpans.get(0).innerText;

      let isUncheckAllAtPage = this.get('allSelectAtPage');
      let checkAllAtPageTitle = isUncheckAllAtPage ? i18n.t('components.olv-toolbar.uncheck-all-at-page-button-text') :
      i18n.t('components.olv-toolbar.check-all-at-page-button-text');

      let isUncheckAll = this.get('allSelect');
      let checkAllTitle = isUncheckAll ? i18n.t('components.olv-toolbar.uncheck-all-button-text') :
      i18n.t('components.olv-toolbar.check-all-button-text');

      switch (namedSetting) {
        case checkAllAtPageTitle.toString(): {
          this.send('checkAllAtPage');
          break;
        }

        case checkAllTitle.toString(): {
          this.send('checkAll');
          break;
        }
      }
    },

    /**
      This action is called when click clear sorting button.

      @method actions.clearSorting
      @public
      @param {jQuery.Event} e jQuery.Event by click on clear sorting button
    */
    clearSorting(e) {
      let componentName = this.get('componentName');
      let userSettingsService = this.get('userSettingsService');

      if (!userSettingsService.haveDefaultUserSetting(componentName)) {
        alert('No default usersettings');
        return;
      }

      let defaultDeveloperUserSetting = userSettingsService.getDefaultDeveloperUserSetting(componentName);
      let currentUserSetting = userSettingsService.getCurrentUserSetting(componentName);
      currentUserSetting.sorting = defaultDeveloperUserSetting.sorting;
      userSettingsService.saveUserSetting(componentName, undefined, currentUserSetting)
      .then(record => {
        if (this.get('class') !== 'groupedit-container')
        {
          this.get('objectlistviewEventsService').setSortingTrigger(componentName, currentUserSetting.sorting);
        } else {
          this.set('sorting', currentUserSetting.sorting);
          let objectlistviewEventsService = this.get('objectlistviewEventsService');
          objectlistviewEventsService.updateWidthTrigger(componentName);
        }
      });
    },

    /**
      Applies filters if the `Enter` key has been pressed.

      @method actions.applyFiltersByEnter
    */
    applyFiltersByEnter(e) {
      if (e.keyCode === 13) {
        this._refreshList(this.get('componentName'));
      }
    },

    /**
      Called when filter condition in any column was changed by user.

      @method actions.filterConditionChanged
      @param {Object} filter Object with the filter description.
      @param {String} newCondition The new value of the filter condition.
      @param {String} oldCondition The old value of the filter condition.
    */
    filterConditionChanged(filter, newCondition, oldCondition) {
      if (oldCondition === 'between' || newCondition === 'empty' || newCondition === 'nempty') {
        Ember.set(filter, 'pattern', null);
      }

      let options = this._getFilterComponentByCondition(newCondition, oldCondition);
      let componentForFilterByCondition = this.get('componentForFilterByCondition');
      if (componentForFilterByCondition) {
        Ember.assert(`Need function in 'componentForFilterByCondition'.`, typeof componentForFilterByCondition === 'function');
        Ember.$.extend(true, options, componentForFilterByCondition(newCondition, oldCondition, filter.type));
      }

      Ember.setProperties(filter.component, options);
    },

    /**
      Cleans the filter for one column.

      @method actions.clearFilterForColumn
      @param {Object} filter Object with the filter description.
    */
    clearFilterForColumn(filter) {
      Ember.set(filter, 'component.name', Ember.get(filter, 'component._defaultComponent'));
      Ember.set(filter, 'condition', null);
      Ember.set(filter, 'pattern', null);
    },
  },

  /**
    An overridable method called when objects are instantiated.
    For more information see [init](http://emberjs.com/api/classes/Ember.View.html#method_init) method of [Ember.View](http://emberjs.com/api/classes/Ember.View.html).
  */
  init() {
    this._super(...arguments);
    Ember.assert('ObjectListView must have componentName attribute.', this.get('componentName'));

    if (!this.get('disableHierarchicalMode')) {
      let modelName = this.get('modelName');
      if (modelName) {
        let model = this.get('store').modelFor(modelName);
        let relationships = Ember.get(model, 'relationships');
        let hierarchicalrelationships = relationships.get(modelName);
        if (hierarchicalrelationships.length === 1) {
          this.sendAction('availableHierarchicalMode', hierarchicalrelationships[0].name);
        } else if (hierarchicalrelationships.length > 1) {
          let hierarchyAttribute = this.get('hierarchyAttribute');
          if (!Ember.isNone(hierarchyAttribute)) {
            let hierarchyAttributeExist = Ember.A(hierarchicalrelationships).findBy('name', hierarchyAttribute);
            if (!Ember.isNone(hierarchyAttributeExist)) {
              this.sendAction('availableHierarchicalMode', hierarchyAttribute);
            } else {
              throw new Error(`Property '${hierarchyAttribute}' does not exist in the model.`);
            }
          }
        }
      }
    }

    this.set('selectedRecords', Ember.A());

    let searchForContentChange = this.get('searchForContentChange');
    if (searchForContentChange) {
      this.addObserver('content.[]', this, this._contentDidChangeProxy);
    }

    this.get('objectlistviewEventsService').on('olvAddRow', this, this._addRow);
    this.get('objectlistviewEventsService').on('olvDeleteRows', this, this._deleteRows);
    this.get('objectlistviewEventsService').on('olvDeleteAllRows', this, this._deleteAllRows);
    this.get('objectlistviewEventsService').on('filterByAnyMatch', this, this._filterByAnyMatch);
    this.get('objectlistviewEventsService').on('refreshList', this, this._refreshList);
    this.get('objectlistviewEventsService').on('geSortApply', this, this._setContent);
    this.get('objectlistviewEventsService').on('updateWidth', this, this.setColumnWidths);
    this.get('objectlistviewEventsService').on('updateSelectAll', this, this._selectAll);
    this.get('objectlistviewEventsService').on('moveRow', this, this._moveRow);
    this.get('objectlistviewEventsService').on('filterConditionChanged', this, this._filterConditionChanged);
  },

  /**
    Handler for updateWidth action.

    @method setColumnWidths

    @param {String} componentName The name of object-list-view component.
  */
  setColumnWidths(componentName) {
    let columnsWidthAutoresize = this.get('columnsWidthAutoresize');
    if (columnsWidthAutoresize) {
      this._setColumnWidths(componentName);
    } else {
      if (this.get('eventsBus')) {
        this.get('eventsBus').trigger('setMenuWidth', this.get('componentName'));
      }
    }
  },

  /**
    Called when the element of the view has been inserted into the DOM or after the view was re-rendered.
    For more information see [didInsertElement](http://emberjs.com/api/classes/Ember.Component.html#event_didInsertElement) event of [Ember.Component](http://emberjs.com/api/classes/Ember.Component.html).
  */
  didInsertElement() {
    this._super(...arguments);

    Ember.$(window).on(`resize.${this.get('elementId')}`, () => {
      if (this.get('columnsWidthAutoresize')) {
        this._setColumnWidths();
      } else {
        if (this.get('eventsBus')) {
          this.get('eventsBus').trigger('setMenuWidth', this.get('componentName'));
        }
      }
    });

    if (this.rowClickable) {
      let key = this._getModelKey(this.selectedRecord);
      if (key) {
        this._setActiveRecord(key);
      }
    }

    if (this.get('onEditForm')) {
      this.get('currentController').getCustomContent();
    }

    this._setColumnWidths();
  },

  /**
    Flag indicates whether columns resizable plugin already was initialized.

    @property _colResizableInit
    @type Boolean
    @default false
    @private
  */
  _colResizableInit: false,

  /**
    Field contains index for already rendered row.

    @property _colResizableInit
    @type Number
    @default -1
    @private
  */
  _renderedRowIndex: -1,

  /**
    Called after a component has been rendered, both on initial render and in subsequent rerenders.
    For more information see [didRender](http://emberjs.com/api/classes/Ember.Component.html#method_didRender) method of [Ember.Component](http://emberjs.com/api/classes/Ember.Component.html).
  */
  didRender() {
    this._super(...arguments);

    // Start row by row rendering at first row.
    if (this.get('useRowByRowLoading')) {
      let contentForRender = this.get('contentForRender');
      if (contentForRender) {
        let contentLength = contentForRender.get('length');
        if (contentLength > 0) {
          let renderedRowIndex = this.get('_renderedRowIndex') + 1;

          if (renderedRowIndex >= contentLength) {
            // The last menu needs will be up.
            this.$('.object-list-view-menu .ui.dropdown').removeClass('bottom').not(':first').last().addClass('bottom');
            this.$('.object-list-view-menu > .ui.dropdown').dropdown();

            // Remove long loading spinners.
            this.set('rowByRowLoadingProgress', false);

            this.set('_renderedRowIndex', -1);

            if (this.rowClickable) {
              let key = this._getModelKey(this.selectedRecord);
              if (key) {
                this._setActiveRecord(key);
              }
            }

            this._setColumnWidths();
          } else {
            // Start render row.
            let modelWithKey = contentForRender[renderedRowIndex];
            if (!modelWithKey.get('doRenderData')) {
              modelWithKey.set('doRenderData', true);
              this.set('_renderedRowIndex', renderedRowIndex);

              if (renderedRowIndex === 0) {
                if (this.get('useRowByRowLoadingProgress')) {
                  // Set loading progress.
                  this.set('rowByRowLoadingProgress', true);
                }
              }
            }

            if (this.get('allowColumnResize')) {
              this._reinitResizablePlugin();
            } else {
              let $table = this.$('table.object-list-view');
              $table.colResizable({ disable: true });
            }
          }
        }
      }
    } else {
      if (this.get('allowColumnResize')) {
        this._reinitResizablePlugin();
      } else {
        let $table = this.$('table.object-list-view');
        $table.colResizable({ disable: true });
      }

      // The last menu needs will be up.
      this.$('.object-list-view-menu .ui.dropdown').removeClass('bottom').not(':first').last().addClass('bottom');
      this.$('.object-list-view-menu > .ui.dropdown').dropdown();
    }

    this._setCurrentColumnsWidth();

    if (this.get('fixedHeader')) {
      let $currentTable = this.$('table.object-list-view');
      $currentTable.parent().addClass('fixed-header');

      this._fixedTableHead($currentTable);
    }
  },

  /**
    Restores the state of selected rows after updating the list.

    See [EmberJS API](https://api.emberjs.com/).

    @method didUpdateAttrs
  */
  didUpdateAttrs() {
    Ember.run.scheduleOnce('afterRender', this, this._restoreSelectedRecords);
  },

  /**
    Override to implement teardown.
    For more information see [willDestroy](http://emberjs.com/api/classes/Ember.Component.html#method_willDestroy) method of [Ember.Component](http://emberjs.com/api/classes/Ember.Component.html).
  */
  willDestroy() {
    this.removeObserver('content.[]', this, this._contentDidChangeProxy);

    this.get('objectlistviewEventsService').off('olvAddRow', this, this._addRow);
    this.get('objectlistviewEventsService').off('olvDeleteRows', this, this._deleteRows);
    this.get('objectlistviewEventsService').off('olvDeleteAllRows', this, this._deleteAllRows);
    this.get('objectlistviewEventsService').off('filterByAnyMatch', this, this._filterByAnyMatch);
    this.get('objectlistviewEventsService').off('refreshList', this, this._refreshList);
    this.get('objectlistviewEventsService').off('geSortApply', this, this._setContent);
    this.get('objectlistviewEventsService').off('updateWidth', this, this.setColumnWidths);
    this.get('objectlistviewEventsService').off('updateSelectAll', this, this._selectAll);
    this.get('objectlistviewEventsService').off('moveRow', this, this._moveRow);
    this.get('objectlistviewEventsService').off('filterConditionChanged', this, this._filterConditionChanged);

    this.get('objectlistviewEventsService').clearSelectedRecords(this.get('componentName'));

    this._super(...arguments);
  },

  /**
    Called when the element of the view is going to be destroyed.
    For more information see [willDestroyElement](http://emberjs.com/api/classes/Ember.Component.html#event_willDestroyElement) event of [Ember.Component](http://emberjs.com/api/classes/Ember.Component.html).
  */
  willDestroyElement() {
    this._super(...arguments);

    Ember.$(window).off(`resize.${this.get('elementId')}`);
  },

  /**
    It reinits plugin for column resize.
    Reinit is important for proper position of resize elements.

    @method _reinitResizablePlugin
    @private
  */
  _reinitResizablePlugin() {
    let $currentTable = this.$('table.object-list-view');
    let cols = this.get('columns');
    let helper = this.get('showHelperColumn');
    let menu = this.get('showMenuColumn');
    let disabledColumns = [];
    let fixedColumns = this.get('currentController.defaultDeveloperUserSettings');
    fixedColumns = fixedColumns ? fixedColumns[this.get('componentName')] : undefined;
    fixedColumns = fixedColumns ? fixedColumns.DEFAULT : undefined;
    fixedColumns = fixedColumns ? fixedColumns.columnWidths || [] : [];
    let fixedColumnsWidth = fixedColumns.filter(({ width }) => width);
    fixedColumns = fixedColumns.filter(({ fixed }) => fixed).map(obj => { return obj.propName; });
    for (let k = 0; k < fixedColumnsWidth.length; k++) {
      if (fixedColumnsWidth[k].propName === 'OlvRowMenu') {
        this.$('.object-list-view-menu').css({ 'width': fixedColumnsWidth[k].width + 'px' });
      }

      if (fixedColumnsWidth[k].propName === 'OlvRowToolbar') {
        this.$('.object-list-view-operations').css({ 'width': fixedColumnsWidth[k].width + 'px' });
      }
    }

    if (helper && fixedColumns.indexOf('OlvRowToolbar') > -1) {
      disabledColumns.push(0);
    }

    if (menu && fixedColumns.indexOf('OlvRowMenu') > -1) {
      disabledColumns.push(helper ? cols.length : cols.length - 1);
    }

    for (let i = 0; i < cols.length; i++) {
      let col = cols[i];
      if (fixedColumns.indexOf(col.propName) > -1) {
        disabledColumns.push(i);
        disabledColumns.push(helper ? i + 1 : i - 1);
      }
    }

    // Disable plugin and then init it again.
    $currentTable.colResizable({ disable: true });

    $currentTable.colResizable({
      minWidth: 50,
      disabledColumns: disabledColumns,
      onResize: (e)=> {
        // Save column width as user setting on resize.
        this._afterColumnResize(e);
      }
    });
  },

  /**
    It handles the end of getting user setting with column widths.

    @method _setColumnWidths
    @private

    @param {Array} userSetting User setting to apply to control
  */
  _setColumnWidths(componentName) {
    if (Ember.isBlank(componentName) || this.get('componentName') === componentName) {
      let userSetting;
      if (this.notUseUserSettings) {
        userSetting = this.get('currentController.developerUserSettings');
        userSetting = userSetting ? userSetting[this.get('componentName')] : undefined;
        userSetting = userSetting ? userSetting.DEFAULT : undefined;
        userSetting = userSetting ? userSetting.columnWidths : undefined;
      } else {
        userSetting = this.get('userSettingsService').getCurrentColumnWidths(this.get('componentName'));
      }

      userSetting = Ember.isArray(userSetting) ? Ember.A(userSetting) : Ember.A();

      let $table = this.$('table.object-list-view');
      let $columns = $table.find('th');

      if (this.get('allowColumnResize')) {
        $table.addClass('fixed');
        this._reinitResizablePlugin();
      } else {
        $table.colResizable({ disable: true });
      }

      let hashedUserSetting = {};
      let tableWidth = 0;
      let olvRowMenuWidth = 0;
      let olvRowToolbarWidth = 0;
      let padding = (this.get('defaultLeftPadding') || 0) * 2;
      let minAutoColumnWidth = this.get('minAutoColumnWidth');

      Ember.$.each($columns, (key, item) => {
        let currentItem = this.$(item);
        let currentPropertyName = this._getColumnPropertyName(currentItem);
        Ember.assert('Column property name is not defined', currentPropertyName);

        let setting = userSetting.filter(sett => (sett.propName === currentPropertyName) && !Ember.isBlank(sett.width));
        setting = setting.length > 0 ? setting[0] : undefined;
        if (!setting) {
          setting = {};
          setting.propName = currentPropertyName;
          if (currentPropertyName === 'OlvRowMenu') {
            setting.width = 68 - padding;
          }

          if (currentPropertyName === 'OlvRowToolbar') {
            let checkbox = this.get('showCheckBoxInRow');
            let delButton = this.get('showDeleteButtonInRow');
            let editButton = this.get('showEditButtonInRow');

            // TODO: Probably need to replace this.
            setting.width = (checkbox && delButton && editButton ? 130 : (checkbox && delButton) || (checkbox && editButton) ||
            (delButton && editButton) ? 100 : checkbox || delButton || editButton ? 86 : 65) - padding;
          }
        }

        tableWidth += padding + (setting.width || minAutoColumnWidth || 1);
        if (currentPropertyName === 'OlvRowToolbar') {
          olvRowToolbarWidth = setting.width;
        }

        if (currentPropertyName === 'OlvRowMenu') {
          olvRowMenuWidth = setting.width;
        }

        hashedUserSetting[setting.propName] = setting.width || minAutoColumnWidth || 1;
      });

      let helperColumnsWidth = (olvRowMenuWidth || 0) + (olvRowToolbarWidth || 0);
      let containerWidth = $table[0].parentElement.clientWidth - 5;
      let columnsWidthAutoresize = this.get('columnsWidthAutoresize');
      if ($columns.length === 0) {
        tableWidth = containerWidth;
      }

      let widthCondition = columnsWidthAutoresize && containerWidth > tableWidth;
      $table.css({ 'width': (columnsWidthAutoresize ? containerWidth : tableWidth) + 'px' });
      if (this.get('eventsBus')) {
        this.get('eventsBus').trigger('setMenuWidth', this.get('componentName'), tableWidth, containerWidth);
      }

      Ember.$.each($columns, (key, item) => {
        let currentItem = this.$(item);
        let currentPropertyName = this._getColumnPropertyName(currentItem);
        Ember.assert('Column property name is not defined', currentPropertyName);

        let savedColumnWidth = hashedUserSetting[currentPropertyName];
        if (savedColumnWidth) {
          if (widthCondition && currentPropertyName !== 'OlvRowToolbar' && currentPropertyName !== 'OlvRowMenu') {
            savedColumnWidth = (savedColumnWidth + padding) / (tableWidth - helperColumnsWidth) * (containerWidth - helperColumnsWidth) - 1;
            currentItem.width(savedColumnWidth - padding);
          } else {
            currentItem.width(savedColumnWidth);
          }
        }
      });

      if (this.get('allowColumnResize')) {
        this._reinitResizablePlugin();
      }
    }
  },

  /**
    It handles the end of column resize.
    New column widths are send to user settings service for saving.

    @method _afterColumnResize
    @private

    @param {Object} eventParams Parameters of the end of column resizing
  */
  _afterColumnResize(eventParams) {

    // Send info to service with user settings.
    let userWidthSettings = [];
    let $columns = this.$(eventParams.currentTarget).find('th');
    Ember.$.each($columns, (key, item) => {
      let currentItem = this.$(item);
      let currentPropertyName = this._getColumnPropertyName(currentItem);
      Ember.assert('Column property name is not defined', currentPropertyName);

      // There can be fractional values potentially.
      let currentColumnWidth = currentItem.width();
      currentColumnWidth = Math.round(currentColumnWidth);

      userWidthSettings.push({
        propName: currentPropertyName,
        width: currentColumnWidth
      });
    });
    this._setCurrentColumnsWidth();
    this.get('userSettingsService').setCurrentColumnWidths(this.get('componentName'), undefined, userWidthSettings);
  },

  /**
    This method returns property name for column.
    Property name is got from atribute `data-olv-header-property-name` of column header.
    If property name won't be found, exeption will be thrown.

    @method _getColumnPropertyName
    @private

    @param {Object} currentItem Current column header to get property name from
    @return {String} Corresponding property name for column
  */
  _getColumnPropertyName(currentItem) {
    let currentPropertyName = currentItem.attr('data-olv-header-property-name');
    if (!currentPropertyName) {
      currentPropertyName =
        currentItem.find('*[data-olv-header-property-name]').attr('data-olv-header-property-name');
    }

    Ember.assert(
    'There is no tag with attribute \'data-olv-header-property-name\' at column header.', currentPropertyName);
    return currentPropertyName;
  },

  /**
    Generate the columns.

    @method _generateColumns
    @private
  */
  _generateColumns(attributes, columnsBuf, relationshipPath) {
    columnsBuf = columnsBuf || Ember.A();
    relationshipPath = relationshipPath || '';

    for (let attrName in attributes) {
      let currentRelationshipPath = relationshipPath;
      if (!attributes.hasOwnProperty(attrName)) {
        continue;
      }

      let attr = attributes[attrName];
      Ember.assert(`Unknown kind of projection attribute: ${attr.kind}`, attr.kind === 'attr' || attr.kind === 'belongsTo' || attr.kind === 'hasMany');
      switch (attr.kind) {
        case 'hasMany':
          break;

        case 'belongsTo':
          if (!attr.options.hidden) {
            let bindingPath = currentRelationshipPath + attrName;
            let column = this._createColumn(attr, attrName, bindingPath);

            if (column.cellComponent.componentName === undefined) {
              if (attr.options.displayMemberPath) {
                column.propName += '.' + attr.options.displayMemberPath;
              } else {
                column.propName += '.id';
              }
            }

            columnsBuf.pushObject(column);
          }

          currentRelationshipPath += attrName + '.';
          this._generateColumns(attr.attributes, columnsBuf, currentRelationshipPath);
          break;

        case 'attr':
          if (attr.options.hidden) {
            break;
          }

          let bindingPath = currentRelationshipPath + attrName;
          let column = this._createColumn(attr, attrName, bindingPath);
          columnsBuf.pushObject(column);
          break;
      }
    }

    return columnsBuf.sortBy('index');
  },

  /**
    Set current columns width for currentController.

    @method _setCurrentColumnsWidth
    @private
  */
  _setCurrentColumnsWidth() {
    if (!Ember.isNone(this.get('currentController'))) {
      let $columns = this.$('table.object-list-view').find('th');
      let currentWidths = {};
      Ember.$.each($columns, (key, item) => {
        let currentItem = this.$(item);
        let currentPropertyName = this._getColumnPropertyName(currentItem);
        Ember.assert('Column property name is not defined', currentPropertyName);

        let currentColumnWidth = currentItem.width();
        currentColumnWidth = Math.round(currentColumnWidth);
        currentWidths[currentPropertyName] = currentColumnWidth;
      });

      let widthsFunction = this.get('currentController.setColumnsWidths');
      if (widthsFunction instanceof Function) {
        widthsFunction.apply(this.get('currentController'), [this.get('componentName'), currentWidths]);
      } else {
        this.set('currentController.currentColumnsWidths', currentWidths);
      }
    }
  },

  /**
    Create the key from locales.
  */
  _createKey(bindingPath) {
    let projection = this.get('modelProjection');
    let modelName = projection.modelName;
    let key;

    let mainModelProjection = this.get('mainModelProjection');
    if (mainModelProjection) {
      let modelClass = this.get('store').modelFor(modelName);
      let nameRelationship;
      let mainModelName;

      modelClass.eachRelationship(function(name, descriptor) {
        if (descriptor.kind === 'belongsTo' && descriptor.options.inverse) {
          nameRelationship = descriptor.options.inverse;
          mainModelName = descriptor.type;
        }
      });
      key = getAttrLocaleKey(mainModelName, mainModelProjection.projectionName, bindingPath, nameRelationship);
    } else {
      key = getAttrLocaleKey(modelName, projection.projectionName, bindingPath);
    }

    return key;
  },

  /**
    Create the column.

    @method _createColumn
    @private
  */
  _createColumn(attr, attrName, bindingPath) {

    // We get the 'getCellComponent' function directly from the controller,
    // and do not pass this function as a component attrubute,
    // to avoid 'Ember.Object.create no longer supports defining methods that call _super' error,
    // if controller's 'getCellComponent' method call its super method from the base controller.
    let currentController = this.get('currentController');
    let getCellComponent = Ember.get(currentController || {}, 'getCellComponent');
    let cellComponent = this.get('cellComponent');

    if (!this.get('editOnSeparateRoute') && Ember.typeOf(getCellComponent) === 'function') {
      let recordModel = Ember.isNone(this.get('content')) ? null : this.get('content.type');
      cellComponent = getCellComponent.call(currentController, attr, bindingPath, recordModel);

      let orderedProperty = this.get('orderedProperty');
      if (!Ember.isNone(orderedProperty) && orderedProperty === bindingPath) {
        if (Ember.isNone(cellComponent.componentProperties)) {
          cellComponent.componentProperties = {};
        }

        Ember.set(cellComponent.componentProperties, 'readonly', true);
      }
    }

    let key = this._createKey(bindingPath);
    let valueFromLocales = getValueFromLocales(this.get('i18n'), key);
    let index = Ember.get(attr, 'options.index');

    let column = {
      header: valueFromLocales || attr.caption || Ember.String.capitalize(attrName),
      propName: bindingPath, // TODO: rename column.propName
      cellComponent: cellComponent,
      index: index,
    };

    if (valueFromLocales) {
      column.keyLocale = key;
    }

    let customColumnAttributesFunc = this.get('customColumnAttributes');
    if (customColumnAttributesFunc) {
      let customColAttr = customColumnAttributesFunc(attr, bindingPath);
      if (customColAttr && (typeof customColAttr === 'object')) {
        Ember.$.extend(true, column, customColAttr);
      }
    }

    if (this.get('enableFilters')) {
      this._addFilterForColumn(column, attr, bindingPath);
    }

    let sortDef;
    let sorting = this.get('sorting');
    if (sorting && (sortDef = sorting[bindingPath])) {
      column.sorted = true;
      column.sortAscending = sortDef.sortAscending;
      column.sortNumber = sortDef.sortNumber;
    }

    return column;
  },

  /**
    Add filter parameters for column.

    @method _addFilterForColumn
    @param {Object} column
    @param {Object} attr
    @param {String} bindingPath
  */
  _addFilterForColumn(column, attr, bindingPath) {
    let relation = attr.kind !== 'attr';
    let attribute = this._getAttribute(attr, bindingPath);

    let conditions;
    let conditionsByType = this.get('conditionsByType');
    if (conditionsByType) {
      Ember.assert(`Need function in 'conditionsByType'.`, typeof conditionsByType === 'function');
      conditions = conditionsByType(attribute.type, attribute);
    } else {
      conditions = this._conditionsByType(attribute.type);
    }

    let name = relation ? `${bindingPath}.${attribute.name}` : bindingPath;
    let type = attribute.type;
    let pattern;
    let condition;

    let filters = this.get('filters');
    if (filters && filters.hasOwnProperty(name)) {
      pattern = filters[name].pattern;
      condition = filters[name].condition;
    }

    let component = this._getFilterComponent(type);
    let componentForFilter = this.get('componentForFilter');
    if (componentForFilter) {
      Ember.assert(`Need function in 'componentForFilter'.`, typeof componentForFilter === 'function');
      Ember.$.extend(true, component, componentForFilter(attribute.type, relation, attribute));
    }

    let options = this._getFilterComponentByCondition(condition, null);
    let componentForFilterByCondition = this.get('componentForFilterByCondition');
    if (componentForFilterByCondition) {
      Ember.assert(`Need function in 'componentForFilterByCondition'.`, typeof componentForFilterByCondition === 'function');
      Ember.$.extend(true, options, componentForFilterByCondition(condition, null, type));
    }

    Ember.$.extend(true, component, options);

    // Hack to restore component when clearing filter for one column.
    component._defaultComponent = component.name;

    column.filter = { name, type, pattern, condition, conditions, component };
  },

  /**
    Return attribute of model.

    @method _getAttribute
    @param {Object} attr
    @param {String} bindingPath
    @return {Object} Return attribute of model.
  */
  _getAttribute(attr, bindingPath) {
    let modelName;
    let attributeName;
    if (attr.kind !== 'attr') {
      attributeName = attr.options.displayMemberPath;
      modelName = attr.modelName;
    } else if (bindingPath.indexOf('.') > 0) {
      let path = bindingPath.split('.');
      attributeName = path.pop();
      modelName = this.get(`modelProjection.attributes.${path.join('.attributes.')}.modelName`);
    } else {
      attributeName = bindingPath;
      modelName = this.get('modelProjection.modelName');
    }

    let model = this.get('store').modelFor(modelName);
    return Ember.get(model, 'attributes').get(attributeName);
  },

  /**
    Return available conditions for filter.

    @method _conditionsByType
    @param {String} type
    @return {Array} Available conditions for filter.
  */
  _conditionsByType(type) {
    switch (type) {
      case 'file':
        return null;

      case 'date':
        return {
          'eq': this.get('i18n').t('components.object-list-view.filters.eq'),
          'neq': this.get('i18n').t('components.object-list-view.filters.neq'),
          'le': this.get('i18n').t('components.object-list-view.filters.le'),
          'ge': this.get('i18n').t('components.object-list-view.filters.ge'),
        };
      case 'number':
        return {
          'eq': this.get('i18n').t('components.object-list-view.filters.eq'),
          'neq': this.get('i18n').t('components.object-list-view.filters.neq'),
          'le': this.get('i18n').t('components.object-list-view.filters.le'),
          'ge': this.get('i18n').t('components.object-list-view.filters.ge'),
          'between': this.get('i18n').t('components.object-list-view.filters.between'),
        };
      case 'string':
        return {
          'eq': this.get('i18n').t('components.object-list-view.filters.eq'),
          'neq': this.get('i18n').t('components.object-list-view.filters.neq'),
          'like': this.get('i18n').t('components.object-list-view.filters.like'),
          'nlike': this.get('i18n').t('components.object-list-view.filters.nlike')
        };

      case 'boolean':
        return {
          'eq': this.get('i18n').t('components.object-list-view.filters.eq'),
          'neq': this.get('i18n').t('components.object-list-view.filters.neq'),
          'nempty': this.get('i18n').t('components.object-list-view.filters.nempty'),
          'empty': this.get('i18n').t('components.object-list-view.filters.empty'),
        };

      default:
        return {
          'eq': this.get('i18n').t('components.object-list-view.filters.eq'),
          'neq': this.get('i18n').t('components.object-list-view.filters.neq')
        };
    }
  },

  /**
    Return object with parameters for component.

    @method _getFilterComponent
    @param {String} type
    @return {Object} Object with parameters for component.
  */
  _getFilterComponent(type) {
    const component = { name: undefined };

    switch (type) {
      case 'file':
        break;

      case 'string':
      case 'number':
        component.name = 'flexberry-textbox';
        break;

      case 'boolean':
        component.name = 'flexberry-dropdown';
        component.properties = {
          items: ['true', 'false'],
          class: 'compact',
        };
        break;

      case 'date':
        component.name = 'flexberry-simpledatetime';
        component.properties = { type: 'date', removeButton: false };
        break;

      default:
        let transformInstance = Ember.getOwner(this).lookup('transform:' + type);
        let transformClass = !Ember.isNone(transformInstance) ? transformInstance.constructor : null;
        if (transformClass && transformClass.isEnum) {
          component.name = 'flexberry-dropdown';
          component.properties = {
            items: transformInstance.get('captions'),
            class: 'compact',
          };
        }

        break;
    }

    return component;
  },

  /**
    Alter filter component depending on condition chosen by user.

    @private
    @method _getFilterComponentByCondition
    @param {String} newCondtition
    @param {String} oldCondition
    @return {Object} Object with parameters for component.
  */
  _getFilterComponentByCondition(newCondition, oldCondition) {
    if (newCondition === 'between') {
      return { name: 'olv-filter-interval' };
    }

    if (oldCondition === 'between') {
      return { name: 'flexberry-textbox' };
    }

    return {};
  },

  /**
    Sets content for component.

    @method _setContent
    @param {String} componentName Name of the component.
    @param {Array} sorting Array of sorting definitions.
  */
  _setContent(componentName, sorting) {
    if (this.get('componentName') === componentName) {
      let content = this.get('content');
      if (content && !content.isLoading) {
        this.set('contentWithKeys', Ember.A());
        this.set('contentForRender', Ember.A());
        if (content instanceof Ember.RSVP.Promise) {
          content.then((items) => {
            items.forEach((item) => {
              this._addModel(item);
            });
          }).then(()=> {
            this.set('contentWithKeys', this.contentForRender);
          });
        } else {
          content.forEach((item) => {
            this._addModel(item);
          });
          this.set('contentWithKeys', this.contentForRender);
        }
      }

      if (Ember.isNone(this.get('orderedProperty')) && Ember.isArray(sorting)) {
        let columns = this.get('columns');
        if (Ember.isArray(columns)) {
          columns.forEach((column) => {
            Ember.set(column, 'sorted', false);
            delete column.sortAscending;
            delete column.sortNumber;
            let idPosition = sorting.length;
            for (let i = 0; i < sorting.length; i++) {
              if (sorting[i].propName === 'id') {
                idPosition = i;
              } else if (column.propName === sorting[i].propName) {
                Ember.set(column, 'sortAscending', sorting[i].direction === 'asc' ? true : false);
                Ember.set(column, 'sorted', true);
                Ember.set(column, 'sortNumber', i > idPosition ? i : i + 1);
              }
            }
          }, this);
        }
      }
    }
  },

  /**
    Refresh list with the entered filter.

    @method _refreshList
    @param {String} componentName
    @private
  */
  _refreshList(componentName) {
    if (this.get('componentName') === componentName) {
      if (this.get('onEditForm')) {
        this.currentController.getCustomContent();
      } else {
        if (this.get('enableFilters')) {
          let filters = {};
          let hasFilters = false;
          this.get('columns').forEach((column) => {
            if (column.filter.condition || column.filter.pattern) {
              hasFilters = true;
              filters[column.filter.name] = column.filter;
            }
          });

          if (hasFilters) {
            this.sendAction('applyFilters', filters, componentName);
          } else {
            if (this.get('currentController.filters')) {
              this.get('currentController').send('resetFilters', componentName);
            } else {
              this.get('currentController').send('refreshList', componentName);
            }
          }
        } else {
          this.get('currentController').send('refreshList', componentName);
        }
      }
    }
  },

  /**
    Get the row by key.

    @method _getRowByKey
    @private
  */
  _getRowByKey(key) {
    let row = null;
    if (Ember.isBlank(key)) {
      return row;
    }

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
    Get the key of model.

    @method _getModelKey
    @private
  */
  _getModelKey(record) {
    if (!this.get('contentWithKeys')) {
      return null;
    }

    let modelWithKeyItem = this.get('contentWithKeys').findBy('data', record);
    return modelWithKeyItem ? modelWithKeyItem.key : null;
  },

  /**
    Remove the model with key.

    @method _removeModelWithKey
    @private
  */
  _removeModelWithKey(key) {
    let itemToRemove = this.get('contentWithKeys').findBy('key', key);
    if (itemToRemove) {
      this.get('contentWithKeys').removeObject(itemToRemove);

      let orderedProperty = this.get('orderedProperty');
      if (!Ember.isNone(orderedProperty)) {
        let valueOrder = itemToRemove.get(`data.${orderedProperty}`);
        let updateItems = this.get('contentWithKeys').filter((value) => value.get(`data.${orderedProperty}`) > valueOrder);
        updateItems.forEach((updateItem) => {
          let data = updateItem.get('data');
          let oldOrder = data.get(`${orderedProperty}`);
          data.set(`${orderedProperty}`, oldOrder - 1);
        });
      }
    }
  },

  /**
    Adds detail model to current model, generates unique key for detail model.
    If record is deleted then `undefined` is returned and record isn't added to list.

    @method _addModel
    @private

    @param {DS.Model} record Detail model to add to current model
    @return {String} Unique key for added record or `undefined` if record is deleted
  */
  _addModel(record) {
    if (record.get('isDeleted')) {
      return undefined;
    }

    let modelWithKey = Ember.Object.create({});
    let key = Ember.guidFor(record);

    modelWithKey.set('key', key);
    modelWithKey.set('data', record);

    let rowConfig = Ember.copy(this.get('defaultRowConfig'));
    modelWithKey.set('rowConfig', rowConfig);
    record.set('rowConfig', rowConfig);

    let configurateRow = this.get('configurateRow');
    if (configurateRow) {
      Ember.assert('configurateRow must be a function', typeof configurateRow === 'function');
      configurateRow(rowConfig, record);
    }

    // Mark previously selected records.
    let componentName = this.get('componentName');
    let selectedRecordsToRestore = this.get('objectlistviewEventsService').getSelectedRecords(componentName);

    if (selectedRecordsToRestore && selectedRecordsToRestore.size && selectedRecordsToRestore.size > 0) {
      selectedRecordsToRestore.forEach((recordWithData, key) => {
        if (record === recordWithData.data) {
          modelWithKey.selected = true;
        }
      });
    }

    if (this.get('useRowByRowLoading')) {
      let modelIndex = this.get('contentForRender.length');
      modelWithKey.set('modelIndex', modelIndex);
      modelWithKey.set('doRenderData', false);
    } else {
      modelWithKey.set('doRenderData', true);
    }

    this.get('contentForRender').pushObject(modelWithKey);

    return key;
  },

  /**
    Adds row to component and calls click on row action if detail is edited on separate route.
    This method is triggered on toolbar's add batton click.

    @method _addRow
    @private

    @param {String} componentName The name of triggered component
  */
  _addRow(componentName) {
    if (componentName === this.get('componentName')) {
      if (this.get('editOnSeparateRoute')) {

        // Depending on settings current model has to be saved before adding detail.
        this.send('rowClick', undefined, undefined);
      } else {
        const modelName = this.get('modelProjection').modelName;
        const modelToAdd = this.get('store').createRecord(modelName, { id: generateUniqueId() });
        if (!Ember.isNone(this.get('orderedProperty'))) {
          modelToAdd.set(`${this.get('orderedProperty')}`, this.get('content').length + 1);
        }

        this._addModel(modelToAdd);
        this.get('content').addObject(modelToAdd);
        this.get('objectlistviewEventsService').rowAddedTrigger(componentName, modelToAdd);
      }
    }
  },

  /**
    Handler for "delete all rows on all pages" event in objectlistview.

    @method _deleteRows

    @param {String} componentName The name of objectlistview component
    @param {Object} filterQuery Filter applying before delete all records on all pages
  */
  _deleteAllRows(componentName, filterQuery) {
    if (componentName === this.get('componentName')) {
      let currentController = this.get('currentController');
      currentController.onDeleteActionStarted();
      let beforeDeleteAllRecords = this.get('beforeDeleteAllRecords');
      let possiblePromise = null;
      let modelName = this.get('modelName');
      let data = {
        cancel: false,
        filterQuery: filterQuery,
        componentName: componentName
      };

      if (beforeDeleteAllRecords) {
        Ember.assert('beforeDeleteAllRecords must be a function', typeof beforeDeleteAllRecords === 'function');

        possiblePromise = beforeDeleteAllRecords(modelName, data);

        if ((!possiblePromise || !(possiblePromise instanceof Ember.RSVP.Promise)) && data.cancel) {
          return;
        }
      }

      if (possiblePromise || (possiblePromise instanceof Ember.RSVP.Promise)) {
        possiblePromise.then(() => {
          if (!data.cancel) {
            this._actualDeleteAllRecords(componentName, modelName, data.filterQuery);
          }
        });
      } else {
        this._actualDeleteAllRecords(componentName, modelName, data.filterQuery);
      }
    }
  },

  /**
    Actually delete the all records on all pages.

    @method _actualDeleteAllRecords
    @private

    @param {String} componentName The name of objectlistview component
    @param {String} modelName Model name that defines type of records to delete
    @param {Object} filterQuery Filter applying before delete all records
  */
  _actualDeleteAllRecords(componentName, modelName, filterQuery) {
    let currentController = this.get('currentController');
    this.get('appState').loading();
    let promise = this.get('store').deleteAllRecords(modelName, filterQuery);

    promise.then((data)=> {
      if (data.deletedCount > -1) {
        this.get('appState').success();
        this.get('objectlistviewEventsService').rowsDeletedTrigger(componentName, data.deletedCount, true);
        currentController.onDeleteActionFulfilled(true);
        this.get('objectlistviewEventsService').refreshListTrigger(componentName);
      } else {
        this.get('appState').error();
        let errorData = {
          message: data.message
        };

        currentController.onDeleteActionRejected(errorData);
        currentController.send('handleError', errorData);
      }
    }).catch((errorData) => {
      this.get('appState').error();
      if (!Ember.isNone(errorData.status) && errorData.status === 0 && !Ember.isNone(errorData.statusText) &&  errorData.statusText === 'error') {
        // This message will be converted to corresponding localized message.
        errorData.message = 'Ember Data Request returned a 0 Payload (Empty Content-Type)';
      }

      currentController.onDeleteActionRejected(errorData);
      this.get('currentController').send('handleError', errorData);
    }).finally((data) => {
      currentController.onDeleteActionAlways(data);
    });
  },

  /**
    Handler for "delete selected rows" event in objectlistview.

    @method _deleteRows

    @param {String} componentName The name of objectlistview component
    @param {Boolean} immediately Flag to delete record immediately
  */
  _deleteRows(componentName, immediately) {
    if (componentName === this.get('componentName')) {
      let selectedRecords = this.get('selectedRecords');
      let count = selectedRecords.length;
      selectedRecords.forEach((item, index, enumerable) => {
        Ember.run.once(this, function() {
          this._deleteRecord(item, immediately);
        });
      }, this);

      selectedRecords.clear();
      this.get('objectlistviewEventsService').rowsDeletedTrigger(componentName, count, immediately);
    }
  },

  /**
    Delete the record.

    @method _deleteRecord
    @private

    @param {DS.Model} record A record to delete
    @param {Boolean} immediately If `true`, relationships have been destroyed (delete and save)
  */
  _deleteRecord(record, immediately) {
    let currentController = this.get('currentController');
    currentController.onDeleteActionStarted();
    let beforeDeleteRecord = this.get('beforeDeleteRecord');
    let possiblePromise = null;
    let data = {
      immediately: immediately,
      cancel: false
    };

    if (beforeDeleteRecord) {
      Ember.assert('beforeDeleteRecord must be a function', typeof beforeDeleteRecord === 'function');

      possiblePromise = beforeDeleteRecord(record, data);

      if ((!possiblePromise || !(possiblePromise instanceof Ember.RSVP.Promise)) && data.cancel) {
        return;
      }
    }

    if (possiblePromise || (possiblePromise instanceof Ember.RSVP.Promise)) {
      possiblePromise.then(() => {
        if (!data.cancel) {
          this._actualDeleteRecord(record, data.immediately);
        }
      });
    } else {
      this._actualDeleteRecord(record, data.immediately);
    }
  },

  /**
    Actually delete the record.

    @method _actualDeleteRecord
    @private

    @param {DS.Model} record A record to delete
    @param {Boolean} immediately If `true`, relationships have been destroyed (delete and save)
  */

  _actualDeleteRecord(record, immediately) {
    let currentController = this.get('currentController');
    let key = this._getModelKey(record);
    this._removeModelWithKey(key);

    this._deleteHasManyRelationships(record, immediately).then(() => immediately ? record.destroyRecord().then(() => {
      this.sendAction('saveAgregator');
      currentController.onDeleteActionFulfilled(true);
    }) : record.deleteRecord()).catch((reason) => {

      currentController.onDeleteActionRejected(reason, record);
      currentController.send('error', reason);

      record.rollbackAll();
    }).finally((data) => {
      currentController.onDeleteActionAlways(data);
    });

    let componentName = this.get('componentName');
    this.get('objectlistviewEventsService').rowDeletedTrigger(componentName, record, immediately);
  },

  /**
    Delete all hasMany relationships in the `record`.

    @method _deleteHasManyRelationships
    @private

    @param {DS.Model} record A record with relationships to delete
    @param {Boolean} immediately If `true`, relationships have been destroyed (delete and save)
    @return {Promise} A promise that will be resolved when relationships have been deleted
  */
  _deleteHasManyRelationships(record, immediately) {
    let promises = Ember.A();
    record.eachRelationship((name, desc) => {
      if (desc.kind === 'hasMany') {
        record.get(name).forEach((relRecord) => {
          promises.pushObject(immediately ? relRecord.destroyRecord() : relRecord.deleteRecord());
        });
      }
    });

    return Ember.RSVP.all(promises);
  },

  /**
    The handler for "filter by any match" event triggered in objectlistview events service.

    @method _filterByAnyMatch
    @private

    @param {String} pattern The pattern to filter objects
  */
  _filterByAnyMatch(componentName, pattern) {
    if (this.get('componentName') === componentName) {
      let anyWord = this.get('filterByAnyWord');
      let allWords = this.get('filterByAllWords');
      Ember.assert(`Only one of the options can be used: 'filterByAnyWord' or 'filterByAllWords'.`, !(allWords && anyWord));
      let filterCondition = anyWord || allWords ? (anyWord ? 'or' : 'and') : undefined;
      this.sendAction('filterByAnyMatch', pattern, filterCondition, componentName);
    }
  },

  /**
    Set the active record.

    @method _setActiveRecord
    @private

    @param {String} key The key of record
  */
  _setActiveRecord(key) {
    // Hide highlight from previously activated row.
    this.$('tbody tr.active').removeClass('active');

    // Activate specified row.
    let $selectedRow = this._getRowByKey(key);
    if ($selectedRow) {
      $selectedRow.addClass('active');
    }
  },

  // TODO: why this observer here in olv, if it is needed only for groupedit? And why there is still no group-edit component?
  _rowsChanged: Ember.observer('content.@each.dirtyType', function() {
    let content = this.get('content');
    if (Ember.isArray(content) && content.isAny('dirtyType', 'updated')) {
      let componentName = this.get('componentName');
      this.get('objectlistviewEventsService').rowsChangedTrigger(componentName);
    }
  }),

  /**
    It observes changes of flag {{#crossLink "ObjectListViewComponent/searchForContentChange:property"}}searchForContentChange{{/crossLink}}.

    If flag {{#crossLink "ObjectListViewComponent/searchForContentChange:property"}}{{/crossLink}} changes its value
    observer on component content is set otherwise it is removed.

    @method _searchForContentChange
    @private
  */
  _searchForContentChange: Ember.observer('searchForContentChange', function() {
    let searchForContentChange = this.get('searchForContentChange');
    if (searchForContentChange) {
      this.addObserver('content.[]', this, this._contentDidChangeProxy);
    } else {
      this.removeObserver('content.[]', this, this._contentDidChangeProxy);
    }
  }),

  /**
    Schedules the `_contentDidChange` function to run once in the `render` queue.

    @private
    @method _contentDidChangeProxy
  */
  _contentDidChangeProxy() {
    Ember.run.scheduleOnce('render', this, this._contentDidChange);
  },

  /**
    It observes changes of model's data that are displayed on component
    if flag {{#crossLink "ObjectListViewComponent/searchForContentChange:property"}}{{/crossLink}} is enabled.

    Property changing displayes automatically.
    Component compares current detail array with used on component,
    removes deleted and marked as deleted on model level records, adds created on model level records.

    @method _contentDidChange
    @private
  */
  _contentDidChange() {

    // Property changing displays automatically.
    let content = this.get('content');
    let contentWithKeys = this.get('contentWithKeys');
    let componentName = this.get('componentName');
    let immediateDelete = this.get('immediateDelete');
    let selectedRecords = this.get('selectedRecords');

    // Search for added and deleted records.
    let addedItems = [];
    let deletedItems = [];
    content.forEach((item) => {
      let foundRecord = this._getModelKey(item);
      let isDeleted = item.get('isDeleted');
      if (!foundRecord && !isDeleted) {
        addedItems.push(item);
      } else if (foundRecord && isDeleted) {
        deletedItems.push(item);
      }
    });

    contentWithKeys.forEach((item) => {
      let record = item.get('data');
      if (!content.contains(record)) {
        deletedItems.push(record);
      }
    });

    // Apply changes to component.
    addedItems.forEach((addedItem) => {
      this._addModel(addedItem);
      this.get('objectlistviewEventsService').rowAddedTrigger(componentName, addedItem);
    });

    deletedItems.forEach((deletedItem) => {
      let key = this._getModelKey(deletedItem);
      this._removeModelWithKey(key);
      selectedRecords.removeObject(deletedItem);
      this.get('objectlistviewEventsService').rowDeletedTrigger(componentName, deletedItem, immediateDelete);
    });
  },

  /**
    Get attributes name from model.

    @method _getAttributesName
    @private
  */
  _getAttributesName() {
    let attributes = this.get('_modelProjection').attributes;
    let attrsArray = [];

    for (let attrName in attributes) {
      attrsArray.push(attrName);
    }

    return attrsArray;
  },

  /**
    Restore selected records after refreshing or transition to other page.

    @method _restoreSelectedRecords
    @private
  */
  _restoreSelectedRecords() {
    // Restore selected records.
    // TODO: when we will ask user about actions with selected records clearing selected records won't be use, because it resets selecting on other pages.
    if (this.get('selectedRecords')) {
      this.get('selectedRecords').clear();
    }

    let componentName = this.get('componentName');

    let selectedRecordsToRestore = this.get('objectlistviewEventsService').getSelectedRecords(componentName);

    if (selectedRecordsToRestore && selectedRecordsToRestore.size && selectedRecordsToRestore.size > 0) {
      let e = {
        checked: true
      };

      let someRecordWasSelected = false;
      selectedRecordsToRestore.forEach((recordWithData, key) => {
        if (this._getModelKey(recordWithData.data)) {
          someRecordWasSelected = true;
          this.send('selectRow', recordWithData, e);
        }
      });

      if (!someRecordWasSelected && !this.get('allSelect')) {
        // Reset toolbar buttons enabled state.
        this.get('objectlistviewEventsService').rowSelectedTrigger(componentName, null, 0, false, null);
      }
    } else if (!this.get('allSelect')) {
      // Reset toolbar buttons enabled state.
      this.get('objectlistviewEventsService').rowSelectedTrigger(componentName, null, 0, false, null);
    }
  },

  /**
    Select/Unselect all records on all pages.

    @method _selectAll
    @private
  */
  _selectAll(componentName, selectAllParameter, skipConfugureRows) {
    if (componentName === this.componentName)
    {
      this.set('allSelect', selectAllParameter);

      let contentWithKeys = this.get('contentWithKeys');
      let selectedRecords = this.get('selectedRecords');
      for (let i = 0; i < contentWithKeys.length; i++) {
        let recordWithKey = contentWithKeys[i];
        let selectedRow = this._getRowByKey(recordWithKey.key);

        if (selectAllParameter) {
          if (!selectedRow.hasClass('active')) {
            selectedRow.addClass('active');
          }
        } else {
          if (selectedRow.hasClass('active')) {
            selectedRow.removeClass('active');
          }
        }

        selectedRecords.removeObject(recordWithKey.data);
        recordWithKey.set('selected', selectAllParameter);
        recordWithKey.set('rowConfig.canBeSelected', !selectAllParameter);
      }

      if (!skipConfugureRows) {
        this.selectedRowsChanged();
      }
    }
  },

  /**
    It observes changes of flag {{#crossLink "FlexberryObjectlistviewComponent/showFilters:property"}}showFilters{{/crossLink}}.

    If flag {{#crossLink "FlexberryObjectlistviewComponent/showFilters:property"}}{{/crossLink}} changes its value
    and flag is true trigger scroll.

    @method _showFiltersObserver
    @private
  */
  _showFiltersObserver: Ember.observer('showFilters', function() {
    let showFilters = this.get('showFilters');
    if (showFilters) {
      Ember.run.schedule('afterRender', this, function() {
        Ember.$(this.element).scroll();
      });
    }
  }),

  /**
    Set style of table parent.

    @method _setParent
    @private
  */
  _setParent(settings) {
    let parent = Ember.$(settings.parent);
    let table = Ember.$(settings.table);

    if (!parent.children(table).length) {
      parent.append(table);
    }

    Ember.$('.full.height .flexberry-content .ui.main.container').css('margin-bottom', '0');

    let toolbarsHeight = parent.prev().outerHeight(true) +
                          parent.next().outerHeight(true) +
                          Ember.$('.background-logo').outerHeight() +
                          Ember.$('h3').outerHeight(true) +
                          Ember.$('.footer .flex-container').outerHeight();
    let tableHeight = `calc(100vh - ${toolbarsHeight}px - 0.5rem)`;

    parent
        .css({
          'overflow-x': 'auto',
          'overflow-y': 'auto',
          'max-height': tableHeight
        });
    parent.scroll(function () {
      let top = parent.scrollTop();

      this.find('thead tr > *').css('top', top);

      // fixed filters.
      if (this.find('tbody tr').is('.object-list-view-filters')) {
        this.find('tbody tr.object-list-view-filters').find(' > *').css('top', top);
      }

    }.bind(table));
  },

  /**
    Set fixed cells backgrounds.

    @method _setBackground
    @private
  */
  _setBackground(elements) {
    elements.each(function (k, element) {
      let _element = Ember.$(element);
      let parent = Ember.$(_element).parent();

      let elementBackground = _element.css('background-color');
      elementBackground = (elementBackground === 'transparent' || elementBackground === 'rgba(0, 0, 0, 0)') ? null : elementBackground;

      let parentBackground = parent.css('background-color');
      parentBackground = (parentBackground === 'transparent' || parentBackground === 'rgba(0, 0, 0, 0)') ? null : parentBackground;

      let background = parentBackground ? parentBackground : 'white';
      background = elementBackground ? elementBackground : background;

      _element.css('background-color', background);
    });
  },

  /**
    Fixed table head.

    @method _setBackground
    @private
  */
  _fixedTableHead($currentTable) {
    let defaults = {
      head: true,
      foot: false,
      left: 0,
      right: 0,
      'z-index': 0
    };

    /*
    (Mozila Firefox(version >58) bug fixes)

    If the browser is Firefox (version >58), then
    tableHeadFixer is enabled, otherwise
    thead position: sticky
    */
    let ua = navigator.userAgent;

    if ((ua.search(/Firefox/) !== -1 && ua.split('Firefox/')[1].substr(0, 2) > 58) ||
        (ua.search(/iPhone|iPad/) !== -1 && ua.split('Version/')[1].substr(0, 2) >= 8) ||
        (ua.search(/Android/) !== -1 && ua.split('Chrome/')[1].substr(0, 2) >= 78)) {
      $currentTable
            .find('thead tr > *')
            .css({ 'position':'sticky', 'top':'0' });

    } else {
      let settings = Ember.$.extend({}, defaults);

      settings.table = $currentTable;
      settings.parent = Ember.$(settings.table).parent();
      this._setParent(settings);

      let thead = Ember.$(settings.table).find('thead');
      let cells = thead.find('tr > *');

      this._setBackground(cells);
      cells.css({
        'position': 'relative'
      });
    }
  },

  /**
    Move all selected records.

    @method _moveRow
    @private
  */
  _moveRow(componentName, shift) {
    if (componentName === this.componentName) {
      let contentForRender = this.get('contentForRender');
      let orderedProperty = this.get('orderedProperty');
      let selectedRecords = this.get('selectedRecords').sortBy(`${orderedProperty}`);
      if (shift > 0) {
        selectedRecords.reverseObjects();
      }

      selectedRecords.forEach((record) => {
        let content = contentForRender.map(i => i.data);
        let indexRecord = content.indexOf(record);
        let newIndex = indexRecord + shift;
        if (newIndex >= 0 && newIndex < content.length && !selectedRecords.includes(content[newIndex])) {
          let orderValue = content[indexRecord].get(`${orderedProperty}`);
          let orderValueAbove = content[newIndex].get(`${orderedProperty}`);
          content[indexRecord].set(`${orderedProperty}`, orderValueAbove);
          content[newIndex].set(`${orderedProperty}`, orderValue);

          let temp = [contentForRender[indexRecord]];
          contentForRender.replace(indexRecord, 1);
          contentForRender.replace(newIndex, 0, temp);
        }
      });
    }
  },

  /**
    Calls the `filterConditionChanged` action when filters are displayed in the modal window.

    @private
    @method _filterConditionChanged
    @param {String} componentName The name of the component relative to which the event occurred.
    @param {Object} filter Object with the filter description.
    @param {String} newValue The new value of the filter condition.
    @param {String} oldvalue The old value of the filter condition.
  */
  _filterConditionChanged(componentName, filter, newValue, oldValue) {
    if (this.get('componentName') === componentName) {
      this.send('filterConditionChanged', filter, newValue, oldValue);
    }
  },
});
