/**
  @module ember-flexberry
*/
import $ from 'jquery';
import RSVP from 'rsvp';
import EmberObject, { get, set, computed, observer } from '@ember/object';
import { guidFor, copy } from '@ember/object/internals';
import { assert } from '@ember/debug';
import { A, isArray } from '@ember/array';
import { inject as service } from '@ember/service';
import { typeOf, isBlank, isNone } from '@ember/utils';
import { htmlSafe, capitalize } from '@ember/string';
import { getOwner } from '@ember/application';
import { once, schedule } from '@ember/runloop';

import { translationMacro as t } from 'ember-i18n';
import { getValueFromLocales } from 'ember-flexberry-data/utils/model-functions';
import generateUniqueId from 'ember-flexberry-data/utils/generate-unique-id';

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

  _contentObserver: observer('content', function() {
    this._setContent(this.get('componentName'));

    if (this.get('allSelect'))
    {
      let contentWithKeys = this.get('contentWithKeys');
      let checked = this.get('allSelect');

      contentWithKeys.forEach((item) => {
        item.set('selected', checked);
        item.set('rowConfig.canBeSelected', !checked);
      });
    }
  }),

  sortTitle: t('components.object-list-view.header-title-attr'),

  /**
    Title for table headers.

    @property sortTitleCompute
    @type String
  */
  sortTitleCompute: computed('orderable', 'sortTitle', function() {
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
  modelProjection: computed('_modelProjection', {
    /* eslint-disable no-unused-vars */
    get(key) {
      return this.get('_modelProjection');
    },
    set(key, value) {
      if (typeof value === 'string') {
        let projectionName = value;
        let modelName = this.get('modelName');
        value = getProjectionByName(projectionName, modelName, this.get('store'));
        assert(`Projection with name '${projectionName}' for model with name '${modelName}' is not found.`, value);
      } else if (typeof value !== 'object') {
        throw new Error(`Property 'modelProjection' should be a string or object.`);
      }

      this.set('_modelProjection', value);
      return value;
    },
    /* eslint-enable no-unused-vars */
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

  defaultPaddingStyle: computed('defaultLeftPadding', function() {
    let defaultLeftPadding = this.get('defaultLeftPadding');
    return htmlSafe(`padding-left:${defaultLeftPadding}px !important; padding-right:${defaultLeftPadding}px !important;`);
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
  tableClass: computed('tableStriped', 'rowClickable', 'customTableClass', 'allowColumnResize', function() {
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
  cellComponent: undefined,

  /**
    Custom data for the editform

    @property {Object} customParameters
  */
  customParameters: undefined,

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
  showHelperColumn: computed(
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
    Flag indicates whether to show dropdown menu with prototype menu item, in last column of every row.

    @property showPrototypeMenuItemInRow
    @type Boolean
    @default false
  */
  showPrototypeMenuItemInRow: false,

  /**
    Flag indicates that on page selected all records.

    @property allSelectAtPage
    @type Boolean
    @default false
  */
  allSelectAtPage: false,

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
  menuInRowHasAdditionalItems: computed('menuInRowAdditionalItems.[]', function() {
    let menuInRowAdditionalItems = this.get('menuInRowAdditionalItems');
    return isArray(menuInRowAdditionalItems) && menuInRowAdditionalItems.length > 0;
  }),

  /**
    Flag indicates whether to show menu column or not.

    @property showMenuColumn
    @type Boolean
    @readOnly
  */
  showMenuColumn: computed(
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
  columns: computed('modelProjection', 'enableFilters', 'content', function() {
    let ret;
    let projection = this.get('modelProjection');

    if (!projection) {
      return A();
    }

    let cols = this._generateColumns(projection.attributes);
    let userSettings;
    if (this.notUseUserSettings) {

      // flexberry-groupedit and lookup-dialog-content set this flag to true and use only developerUserSettings.
      // In future release backend can save userSettings for each olv.
      userSettings = this.get('currentController.developerUserSettings');
      userSettings = userSettings ? userSettings[this.get('componentName')] : undefined;
      userSettings = userSettings ? userSettings.DEFAULT : undefined;
    } else {
      userSettings = this.get('userSettingsService').getCurrentUserSetting(this.get('componentName')); // TODO: Need use promise for loading user settings. There are async promise execution now, called by hook model in list-view route (loading started by call setDeveloperUserSettings(developerUserSettings) but may be not finished yet).
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
      if (isArray(userSettings.columnWidths)) {
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

      if (isNone(this.get('orderedProperty'))) {
        for (let i = 0; i < userSettings.sorting.length; i++) {
          let sorting = userSettings.sorting[i];
          let propName = sorting.propName;
          namedCols[propName].sorted = true;
          namedCols[propName].sortAscending = sorting.direction === 'asc' ? true : false;
          namedCols[propName].sortNumber = i + 1;
        }
      }

      if (userSettings.colsOrder !== undefined) {
        ret = [];
        for (let i = 0; i < userSettings.colsOrder.length; i++) {
          let userSetting = userSettings.colsOrder[i];
          if (!userSetting.hide) {
            let propName = userSetting.propName;
            let col = namedCols[propName];
            ret[ret.length] = col;
          }
        }
      } else {
        ret = cols;
      }
    } else {
      ret = cols;
    }

    return ret;
  }),

  /**
    Total columns count (including additional columns).

    @property colspan
    @type Number
    @readOnly
  */
  colspan: computed('columns.length', 'showHelperColumn', 'showMenuColumn', function() {
    let columnsCount = 0;
    if (this.get('showHelperColumn')) {
      columnsCount += 1;
    }

    if (this.get('showMenuColumn')) {
      columnsCount += 1;
    }

    let columns = this.get('columns');
    columnsCount += isArray(columns) ? columns.length : 0;

    return columnsCount;
  }),

  /**
    @property checkRowsSettingsItems
    @readOnly
  */
  checkRowsSettingsItems: computed(
    'i18n.locale',
    'userSettingsService.isUserSettingsServiceEnabled',
    'readonly',
    'allSelect',
    'allSelectAtPage',
    function() {
      let i18n = this.get('i18n');
      let readonly = this.get('readonly');
      let allSelect = this.get('allSelect');

      let rootItem = {
        icon: 'dropdown icon',
        iconAlignment: 'right',
        title: '',
        items: [],
        localeKey: ''
      };

      let isUncheckAllAtPage = this.get('allSelectAtPage');
      let checkAllAtPageTitle = isUncheckAllAtPage ? i18n.t('components.olv-toolbar.uncheck-all-at-page-button-text') : i18n.t('components.olv-toolbar.check-all-at-page-button-text');
      let checkAllAtPageTitleKey = isUncheckAllAtPage ? 'components.olv-toolbar.uncheck-all-at-page-button-text' : 'components.olv-toolbar.check-all-at-page-button-text';

      let checkAllTitle = allSelect ? i18n.t('components.olv-toolbar.uncheck-all-button-text') : i18n.t('components.olv-toolbar.check-all-button-text');
      let checkAllTitleKey = allSelect ? 'components.olv-toolbar.uncheck-all-button-text' : 'components.olv-toolbar.check-all-button-text';

      if (!readonly) {
        if (!allSelect)
          rootItem.items.push({
            title: checkAllAtPageTitle,
            localeKey: checkAllAtPageTitleKey
          });

        let classNames = this.get('classNames');
        if (classNames != null && !classNames.includes('groupedit-container'))
          rootItem.items.push({
            title: checkAllTitle,
            localeKey: checkAllTitleKey
          });
      }

      return this.get('userSettingsService').isUserSettingsServiceEnabled ? [rootItem] : [];
    }
  ),

  /**
    Flag indicates whether some column contains editable component instead of default cellComponent.
    Don't work if change `componentName` inside `cellComponent`.

    @property hasEditableValues
    @type Boolean
    @readOnly
  */
  hasEditableValues: computed('columns.{[],@each.cellComponent}', function() {
    let columns = this.get('columns');
    if (!isArray(columns)) {
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
  hasContent: computed('contentWithKeys.length', function() {
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
            set(rowConfig, 'canBeDeleted', false);
            if (record.get('isMyFavoriteRecord')) {
              set(rowConfig, 'customClass', 'my-fav-record');
            }

            let readonlyColumns = [];
            if (record.get('isNameColumnReadonly')) {
              readonlyColumns.push('name');
            }

            set(rowConfig, 'readonlyColumns', readonlyColumns);
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

  selectedRowsChanged: observer('selectedRecords.@each', function() {
    let selectedRecords = this.get('selectedRecords');
    let configurateSelectedRows = this.get('configurateSelectedRows');
    if (configurateSelectedRows) {
      assert('configurateSelectedRows must be a function', typeof configurateSelectedRows === 'function');
      configurateSelectedRows(selectedRecords);
    }

    // Set title flag of select all at page button.
    const contentWithKeys = this.get('contentWithKeys');
    if (contentWithKeys) {
      let isAllSelectAtPage = true;
      for (let i = 0; i < contentWithKeys.length; i++) {
        if (!contentWithKeys[i].get('selected')) {
          isAllSelectAtPage = false;
        }
      }
  
      this.set('allSelectAtPage', isAllSelectAtPage);
    }


  }),

  /**
    Default settings for rows.

    @property defaultRowConfig
    @type Object

    @param {Boolean} [canBeDeleted=true] The row can be deleted
    @param {Boolean} [canBeSelected=true] The row can be selected via checkbox
    @param {String} [customClass=''] Custom css classes for the row
  */
  defaultRowConfig: undefined,

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
  store: service('store'),

  /**
    Service that triggers objectlistview events.

    @property objectlistviewEventsService
    @type Service
  */
  objectlistviewEventsService: service('objectlistview-events'),

  /**
    Service for managing the state of the application.

    @property appState
    @type AppStateService
  */
  appState: service(),

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
        let recordModelName = isNone(recordData) ? undefined : recordData.constructor.modelName;

        let $selectedRow = this._getRowByKey(recordKey);
        let editOnSeparateRoute = this.get('editOnSeparateRoute');
        params = params || {};
        /* eslint-disable ember/avoid-leaking-state-in-ember-objects */
        $.extend(params, {
          onEditForm: this.get('onEditForm'),
          saveBeforeRouteLeave: this.get('saveBeforeRouteLeave'),
          editOnSeparateRoute: editOnSeparateRoute,
          modelName: recordModelName || this.get('modelProjection').modelName,
          detailArray: this.get('content'),
          readonly: this.get('readonly'),
          goToEditForm: true,
          customParameters: this.get('customParameters')
        });
        /* eslint-enable ember/avoid-leaking-state-in-ember-objects */
        runAfter(this, () => { return isNone($selectedRow) || $selectedRow.hasClass('active'); }, () => {
          this.get('action')(recordData, params);
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
      if (!this.orderable || column.sortable === false || !isNone(this.get('orderedProperty'))) {
        return;
      }

      let action = e.ctrlKey ? 'addColumnToSorting' : 'sortByColumn';
      this.get(action)(column, this.get('componentName'));
    },

    /**
      This action is called when user click on menu in row.

      @method actions.deleteRow
      @public
      @param {DS.Model} recordWithKey A record with key
      @param {jQuery.Event} e jQuery.Event by click on row
    */
    /* eslint-disable no-unused-vars */
    deleteRow(recordWithKey, e) {

      // TODO: rename recordWithKey. rename record in the template, where it is actually recordWithKey.
      if (this.get('readonly') || !recordWithKey.rowConfig.canBeDeleted) {
        return;
      }

      let confirmDeleteRow = this.get('confirmDeleteRow');
      if (confirmDeleteRow) {
        assert('Error: confirmDeleteRow must be a function.', typeof confirmDeleteRow === 'function');
        if (!confirmDeleteRow()) {
          return;
        }
      }

      this._deleteRecord(recordWithKey.data, this.get('immediateDelete'));
    },
    /* eslint-enable no-unused-vars */

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
  /* eslint-disable no-unused-vars */
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
    /* eslint-enable no-unused-vars */

    /**
      This action is called when click check all at all button.

      @method actions.checkAll
      @public
      @param {jQuery.Event} e jQuery.Event by click on ckeck all button
    */
    /* eslint-disable no-unused-vars */
    checkAll(e) {
      let checked = !this.get('allSelect');

      let componentName = this.get('componentName');
      this.get('objectlistviewEventsService').updateSelectAllTrigger(componentName, checked, true);
      this.selectedRowsChanged();
    },

    /**
      Handler click on flexberry-menu.

      @method actions.onCheckRowMenuItemClick
      @public
      @param {jQuery.Event} e jQuery.Event by click on menu item
    */
    onCheckRowMenuItemClick(e) {
      let namedItemSpans = $(e.currentTarget).find('span');
      if (namedItemSpans.length <= 0) {
        return;
      }

      let i18n = this.get('i18n');
      let namedSetting = namedItemSpans.get(0).innerText;

      let isUncheckAllAtPage = this.get('allSelectAtPage');
      let checkAllAtPageTitle = isUncheckAllAtPage ? i18n.t('components.olv-toolbar.uncheck-all-at-page-button-text') : i18n.t('components.olv-toolbar.check-all-at-page-button-text');

      let isUncheckAll = this.get('allSelect');
      let checkAllTitle = isUncheckAll ? i18n.t('components.olv-toolbar.uncheck-all-button-text') : i18n.t('components.olv-toolbar.check-all-button-text');
     
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

    /* eslint-enable no-unused-vars */

    /**
      This action is called when click clear sorting button.

      @method actions.clearSorting
      @public
      @param {jQuery.Event} e jQuery.Event by click on clear sorting button
    */
    /* eslint-disable no-unused-vars */
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
      Checks if "Enter" button was pressed.
      If "Enter" button was pressed then apply filters.

      @method actions.keyDownFilterAction
    */
    keyDownFilterAction(e) {
      if (e.keyCode === 13) {
        this.get('currentController').send('refreshList', this.get('componentName'));
        e.preventDefault();
        return false;
      }
    },
  },

  /**
    An overridable method called when objects are instantiated.
    For more information see [init](https://emberjs.com/api/ember/release/classes/EmberObject/methods/init?anchor=init) method of [EmberObject](https://emberjs.com/api/ember/release/classes/EmberObject).
  */
  init() {
    this._super(...arguments);
    assert('ObjectListView must have componentName attribute.', this.get('componentName'));

    this.set('selectedRecords', A());
    this.set('cellComponent', {
      componentName: undefined,
      componentProperties: null,
    });
    this.set('defaultRowConfig', {
      canBeDeleted: true,
      canBeSelected: true,
      customClass: ''
    });
    if (isNone(this.get('customParameters'))) {
      this.set('customParameters', {});
    }

    let searchForContentChange = this.get('searchForContentChange');
    if (searchForContentChange) {
      this.addObserver('content.[]', this, this._contentDidChange);
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
    this.get('_contentObserver').apply(this);
    this.get('selectedRowsChanged').apply(this);
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
    For more information see [didInsertElement](https://emberjs.com/api/ember/release/classes/Component#event_didInsertElement) event of [Component](https://emberjs.com/api/ember/release/classes/Component).
  */
  didInsertElement() {
    this._super(...arguments);

    $(window).bind(`resize.${this.get('componentName')}`, $.proxy(function() {
      if (this.get('columnsWidthAutoresize')) {
        this._setColumnWidths();
      } else {
        if (this.get('eventsBus')) {
          this.get('eventsBus').trigger('setMenuWidth', this.get('componentName'));
        }
      }
    }, this));

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
    For more information see [didRender](https://emberjs.com/api/ember/release/classes/Component#method_didRender) method of [Component](https://emberjs.com/api/ember/release/classes/Component).
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
            this._restoreSelectedRecords();

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
      this._restoreSelectedRecords();

      if (this.get('allowColumnResize')) {
        this._reinitResizablePlugin();
      } else {
        let $table = this.$('table.object-list-view');
        $table.colResizable({ disable: true });
      }

      this.$('.object-list-view-menu > .ui.dropdown').dropdown();
    }

    this.$('.object-list-view-menu > .ui.dropdown').dropdown();

    // The last menu needs will be up.
    $('.object-list-view-menu:last .ui.dropdown').addClass('bottom');

    this._setCurrentColumnsWidth();

    if (this.get('fixedHeader')) {
      let $currentTable = this.$('table.object-list-view');
      $currentTable.parent().addClass('fixed-header');

      this._fixedTableHead($currentTable);
    }
  },

  /**
    Override to implement teardown.
    For more information see [willDestroy](https://emberjs.com/api/ember/release/classes/Component#method_willDestroy) method of [Component](https://emberjs.com/api/ember/release/classes/Component).
  */
  willDestroy() {
    this.removeObserver('content.[]', this, this._contentDidChange);

    this.get('objectlistviewEventsService').off('olvAddRow', this, this._addRow);
    this.get('objectlistviewEventsService').off('olvDeleteRows', this, this._deleteRows);
    this.get('objectlistviewEventsService').off('olvDeleteAllRows', this, this._deleteAllRows);
    this.get('objectlistviewEventsService').off('filterByAnyMatch', this, this._filterByAnyMatch);
    this.get('objectlistviewEventsService').off('refreshList', this, this._refreshList);
    this.get('objectlistviewEventsService').off('geSortApply', this, this._setContent);
    this.get('objectlistviewEventsService').off('updateWidth', this, this.setColumnWidths);
    this.get('objectlistviewEventsService').off('updateSelectAll', this, this._selectAll);
    this.get('objectlistviewEventsService').off('moveRow', this, this._moveRow);

    this.get('objectlistviewEventsService').clearSelectedRecords(this.get('componentName'));

    this._super(...arguments);
  },

  /**
    Called when the element of the view is going to be destroyed.
    For more information see [willDestroyElement](https://emberjs.com/api/ember/release/classes/Component#event_willDestroyElement) event of [Component](https://emberjs.com/api/ember/release/classes/Component).
  */
  willDestroyElement() {
    this._super(...arguments);

    $(window).unbind(`resize.${this.get('componentName')}`);
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
    if (isBlank(componentName) || this.get('componentName') === componentName) {
      let userSetting;
      if (this.notUseUserSettings) {
        userSetting = this.get('currentController.developerUserSettings');
        userSetting = userSetting ? userSetting[this.get('componentName')] : undefined;
        userSetting = userSetting ? userSetting.DEFAULT : undefined;
        userSetting = userSetting ? userSetting.columnWidths : undefined;
      } else {
        userSetting = this.get('userSettingsService').getCurrentColumnWidths(this.get('componentName'));
      }

      userSetting = isArray(userSetting) ? A(userSetting) : A();

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

      $.each($columns, (key, item) => {
        let currentItem = this.$(item);
        let currentPropertyName = this._getColumnPropertyName(currentItem);
        assert('Column property name is not defined', currentPropertyName);

        let setting = userSetting.filter(sett => (sett.propName === currentPropertyName) && !isBlank(sett.width));
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

      $.each($columns, (key, item) => {
        let currentItem = this.$(item);
        let currentPropertyName = this._getColumnPropertyName(currentItem);
        assert('Column property name is not defined', currentPropertyName);

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
    $.each($columns, (key, item) => {
      let currentItem = this.$(item);
      let currentPropertyName = this._getColumnPropertyName(currentItem);
      assert('Column property name is not defined', currentPropertyName);

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

    assert(
    'There is no tag with attribute \'data-olv-header-property-name\' at column header.', currentPropertyName);
    return currentPropertyName;
  },

  /**
    Generate the columns.

    @method _generateColumns
    @private
  */
  _generateColumns(attributes, columnsBuf, relationshipPath) {
    columnsBuf = columnsBuf || A();
    relationshipPath = relationshipPath || '';

    for (let attrName in attributes) {
      let currentRelationshipPath = relationshipPath;
      if (!attributes.hasOwnProperty(attrName)) {
        continue;
      }

      let attr = attributes[attrName];
      assert(`Unknown kind of projection attribute: ${attr.kind}`, attr.kind === 'attr' || attr.kind === 'belongsTo' || attr.kind === 'hasMany');
      switch (attr.kind) {
        case 'hasMany':
          break;

        case 'belongsTo': {
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
        }

        case 'attr': {
          if (attr.options.hidden) {
            break;
          }

          let bindingPath = currentRelationshipPath + attrName;
          let column = this._createColumn(attr, attrName, bindingPath);
          columnsBuf.pushObject(column);
          break;
        }
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
    if (!isNone(this.get('currentController'))) {
      let $columns = this.$('table.object-list-view').find('th');
      let currentWidths = {};
      $.each($columns, (key, item) => {
        let currentItem = this.$(item);
        let currentPropertyName = this._getColumnPropertyName(currentItem);
        assert('Column property name is not defined', currentPropertyName);

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
      key = `models.${mainModelName}.projections.${mainModelProjection.projectionName}.${nameRelationship}.${bindingPath}.__caption__`;
    } else {
      key = `models.${modelName}.projections.${projection.projectionName}.${bindingPath}.__caption__`;
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
    // to avoid 'EmberObject.create no longer supports defining methods that call _super' error,
    // if controller's 'getCellComponent' method call its super method from the base controller.
    let currentController = this.get('currentController');
    let getCellComponent = get(currentController || {}, 'getCellComponent');
    let cellComponent = this.get('cellComponent');

    if (!this.get('editOnSeparateRoute') && typeOf(getCellComponent) === 'function') {
      let recordModel = isNone(this.get('content')) ? null : this.get('content.type');
      cellComponent = getCellComponent.call(currentController, attr, bindingPath, recordModel);

      let orderedProperty = this.get('orderedProperty');
      if (!isNone(orderedProperty) && orderedProperty === bindingPath) {
        if (isNone(cellComponent.componentProperties)) {
          cellComponent.componentProperties = {};
        }

        set(cellComponent.componentProperties, 'readonly', true);
      }
    }

    let key = this._createKey(bindingPath);
    let valueFromLocales = getValueFromLocales(this.get('i18n'), key);
    let index = get(attr, 'options.index');

    let column = {
      header: valueFromLocales || attr.caption || capitalize(attrName),
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
        $.extend(true, column, customColAttr);
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
    let component = this._getFilterComponent(attribute.type, relation);
    let componentForFilter = this.get('componentForFilter');
    if (componentForFilter) {
      assert(`Need function in 'componentForFilter'.`, typeof componentForFilter === 'function');
      $.extend(true, component, componentForFilter(attribute.type, relation));
    }

    let conditions;
    let conditionsByType = this.get('conditionsByType');
    if (conditionsByType) {
      assert(`Need function in 'conditionsByType'.`, typeof conditionsByType === 'function');
      conditions = conditionsByType(attribute.type);
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
    return get(model, 'attributes').get(attributeName);
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
      case 'number':
        return ['eq', 'neq', 'le', 'ge'];

      case 'string':
        return ['eq', 'neq', 'like'];

      case 'boolean':
        return ['eq', 'neq'];

      default:
        return ['eq', 'neq'];
    }
  },

  /**
    Return object with parameters for component.

    @method _getFilterComponent
    @param {String} type
    @param {Boolean} relation
    @return {Object} Object with parameters for component.
  */
  /* eslint-disable no-unused-vars */
  _getFilterComponent(type, relation) {
    let _this = this;
    let enterClick = function(e) {
      if (e.which === 13) {
        _this._refreshList(_this.get('componentName'));
      }
    };

    let component = {
      name: undefined,
      properties: { keyDown: enterClick },
    };

    switch (type) {
      case 'file':
        break;

      case 'string': {
        component.name = 'flexberry-textbox';
        component.properties = $.extend(true, component.properties, {
          class: 'compact fluid',
        });
        break;
      }

      case 'number': {
        component.name = 'flexberry-textbox';
        component.properties = $.extend(true, component.properties, {
          class: 'compact fluid',
        });
        break;
      }

      case 'boolean': {
        let itemsArray = ['true', 'false'];
        component.name = 'flexberry-dropdown';
        component.properties = $.extend(true, component.properties, {
          items: itemsArray,
          class: 'compact fluid',
        });
        break;
      }

      case 'date': {
        component.name = 'flexberry-simpledatetime';
        component.properties = $.extend(true, component.properties, {
          type: 'date',
        });
        break;
      }

      default: {
        let transformInstance = getOwner(this).lookup('transform:' + type);
        let transformClass = !isNone(transformInstance) ? transformInstance.constructor : null;
        if (transformClass && transformClass.isEnum) {
          component.name = 'flexberry-dropdown';
          component.properties = $.extend(true, component.properties, {
            items: transformInstance.get('captions'),
            class: 'compact fluid',
          });
        }

        break;
      }
    }

    return component;
  },
  /* eslint-enable no-unused-vars */

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
        this.set('contentWithKeys', A());
        this.set('contentForRender', A());
        if (content instanceof RSVP.Promise) {
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

      if (isArray(sorting) && isNone(this.get('orderedProperty'))) {
        let columns = this.get('columns');
        if (isArray(columns)) {
          columns.forEach((column) => {
            set(column, 'sorted', false);
            delete column.sortAscending;
            delete column.sortNumber;
            let idPosition = sorting.length;
            for (let i = 0; i < sorting.length; i++) {
              if (sorting[i].propName === 'id') {
                idPosition = i;
              } else if (column.propName === sorting[i].propName) {
                set(column, 'sortAscending', sorting[i].direction === 'asc' ? true : false);
                set(column, 'sorted', true);
                set(column, 'sortNumber', i > idPosition ? i : i + 1);
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
            this.get('applyFilters')(filters, componentName);
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
    if (isBlank(key)) {
      return row;
    }

    this.$('tbody tr').each(function() {
      let currentKey = $(this).find('td:eq(0) div:eq(0)').text().trim();
      if (currentKey === key) {
        row = $(this);
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
      if (!isNone(orderedProperty)) {
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

    let modelWithKey = EmberObject.create({});
    let key = guidFor(record);

    modelWithKey.set('key', key);
    modelWithKey.set('data', record);

    let rowConfig = copy(this.get('defaultRowConfig'));
    modelWithKey.set('rowConfig', rowConfig);
    record.set('rowConfig', rowConfig);

    let configurateRow = this.get('configurateRow');
    if (configurateRow) {
      assert('configurateRow must be a function', typeof configurateRow === 'function');
      configurateRow(rowConfig, record);
    }

    // Mark previously selected records.
    let componentName = this.get('componentName');
    let selectedRecordsToRestore = this.get('objectlistviewEventsService').getSelectedRecords(componentName);
    if (selectedRecordsToRestore && selectedRecordsToRestore.size && selectedRecordsToRestore.size > 0) {
      /* eslint-disable no-unused-vars */
      selectedRecordsToRestore.forEach((recordWithData, key) => {
        if (record === recordWithData.data) {
          modelWithKey.selected = true;
        }
      });
      /* eslint-enable no-unused-vars */
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
        if (!isNone(this.get('orderedProperty'))) {
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
        assert('beforeDeleteAllRecords must be a function', typeof beforeDeleteAllRecords === 'function');

        possiblePromise = beforeDeleteAllRecords(modelName, data);

        if ((!possiblePromise || !(possiblePromise instanceof RSVP.Promise)) && data.cancel) {
          return;
        }
      }

      if (possiblePromise || (possiblePromise instanceof RSVP.Promise)) {
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
      if (!isNone(errorData.status) && errorData.status === 0 && !isNone(errorData.statusText) &&  errorData.statusText === 'error') {
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
      selectedRecords.forEach((item) => {
        once(this, function() {
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
      assert('beforeDeleteRecord must be a function', typeof beforeDeleteRecord === 'function');

      possiblePromise = beforeDeleteRecord(record, data);

      if ((!possiblePromise || !(possiblePromise instanceof RSVP.Promise)) && data.cancel) {
        return;
      }
    }

    if (possiblePromise || (possiblePromise instanceof RSVP.Promise)) {
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
      currentController.send('saveAgregator');
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
    let promises = A();
    record.eachRelationship((name, desc) => {
      if (desc.kind === 'hasMany') {
        record.get(name).forEach((relRecord) => {
          promises.pushObject(immediately ? relRecord.destroyRecord() : relRecord.deleteRecord());
        });
      }
    });

    return RSVP.all(promises);
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
      assert(`Only one of the options can be used: 'filterByAnyWord' or 'filterByAllWords'.`, !(allWords && anyWord));
      let filterCondition = anyWord || allWords ? (anyWord ? 'or' : 'and') : undefined;
      this.get('filterByAnyMatch')(pattern, filterCondition, componentName);
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
  _rowsChanged: observer('content.@each.dirtyType', function() {
    let content = this.get('content');
    if (content && !(content instanceof RSVP.Promise) && content.isAny('dirtyType', 'updated')) {
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
  _searchForContentChange: observer('searchForContentChange', function() {
    let searchForContentChange = this.get('searchForContentChange');
    if (searchForContentChange) {
      this.addObserver('content.[]', this, this._contentDidChange);
    } else {
      this.removeObserver('content.[]', this, this._contentDidChange);
    }
  }),

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
      if (!content.includes(record)) {
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
      /* eslint-disable no-unused-vars */
      selectedRecordsToRestore.forEach((recordWithData, key) => {
        if (this._getModelKey(recordWithData.data)) {
          someRecordWasSelected = true;
          this.send('selectRow', recordWithData, e);
        }
      });
      /* eslint-enable no-unused-vars */

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
  _showFiltersObserver: observer('showFilters', function() {
    let showFilters = this.get('showFilters');
    if (showFilters) {
      schedule('afterRender', this, function() {
        $(this.element).scroll();
      });
    }
  }),

  /**
    Set style of table parent.

    @method _setParent
    @private
  */
  _setParent(settings) {
    let parent = $(settings.parent);
    let table = $(settings.table);

    if (!parent.children(table).length) {
      parent.append(table);
    }

    $('.full.height .flexberry-content .ui.main.container').css('margin-bottom', '0');

    let toolbarsHeight = parent.prev().outerHeight(true) +
                          parent.next().outerHeight(true) +
                          $('.background-logo').outerHeight() +
                          $('h3').outerHeight(true) +
                          $('.footer .flex-container').outerHeight();
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
      let _element = $(element);
      let parent = $(_element).parent();

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
      let settings = $.extend({}, defaults);

      settings.table = $currentTable;
      settings.parent = $(settings.table).parent();
      this._setParent(settings);

      let thead = $(settings.table).find('thead');
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
});
