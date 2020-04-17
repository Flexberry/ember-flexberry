import Ember from 'ember';
import folv from './flexberry-objectlistview';
import FlexberryLookupCompatibleComponentMixin from '../mixins/flexberry-lookup-compatible-component';
import FlexberryFileCompatibleComponentMixin from '../mixins/flexberry-file-compatible-component';
import { translationMacro as t } from 'ember-i18n';
import { getValueFromLocales } from 'ember-flexberry-data/utils/model-functions';
import serializeSortingParam from '../utils/serialize-sorting-param';
const { getOwner } = Ember;

/**
  Simple object list view  component.

  @extends FlexberryObjectlistviewComponent
  @uses FlexberryLookupCompatibleComponentMixin
  @uses FlexberryLookupCompatibleComponentMixin
  @uses ErrorableControllerMixin
*/
export default folv.extend(
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
    let content = this.get('content');
    if (content && !content.isLoading) {
      this.set('contentWithKeys', Ember.A());
      this.set('contentForRender', Ember.A());

      let userSettings = this._getUserSettings();
      this.set('_userSettings', userSettings);
      this._setColumnsUserSettings();

      if (content.get('isFulfilled') === false) {
        content.then((items) => {
          items.forEach((item) => {
            this._addModel(item);
          }).then(()=> {
            this.set('contentWithKeys', this.contentForRender);
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

      if (this.get('allSelect'))
      {
        let contentWithKeys = this.get('contentWithKeys');
        let checked = this.get('allSelect');

        contentWithKeys.forEach((item) => {
          item.set('selected', checked);
          item.set('rowConfig.canBeSelected', !checked);
        });
      }
    }
  })),

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
        let modelName = this.get('modelName');
        Ember.assert('For define projection by name, model name is required.', modelName);
        let modelConstructor = this.get('store').modelFor(modelName);
        Ember.assert(`Model with name '${modelName}' is not found.`, modelConstructor);
        let projections = Ember.get(modelConstructor, 'projections');
        Ember.assert(`Projection with name '${value}' for model with name '${modelName}' is not found.`, projections[value]);
        value = projections[value];
      } else if (typeof value !== 'object') {
        throw new Error(`Property 'modelProjection' should be a string or object.`);
      }

      this.set('_modelProjection', value);
      return value;
    },
  }),

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

  defaultPaddingStyle: Ember.computed('defaultLeftPadding', function() {
    let defaultLeftPadding = this.get('defaultLeftPadding');
    return Ember.String.htmlSafe(`padding-left:${defaultLeftPadding}px !important; padding-right:${defaultLeftPadding}px !important;`);
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
  classNames: ['flexberry-simpleolv'],

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
    Flag indicates whether to show delete button in first column of every row.

    @property showEditButtonInRow
    @type Boolean
    @default false
  */
  showEditButtonInRow: false,

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
    'showDeleteButtonInRow',
    'showEditButtonInRow',
    'modelProjection',
    function() {
    if (this.get('modelProjection')) {
      return this.get('showAsteriskInRow') || this.get('showCheckBoxInRow') || this.get('showDeleteButtonInRow') || this.get('showEditButtonInRow');
    } else {
      return false;
    }
  }),

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
    'showDeleteMenuItemInRow',
    'menuInRowHasAdditionalItems',
    function() {
      return this.get('showEditMenuItemInRow') || this.get('showDeleteMenuItemInRow') || this.get('menuInRowHasAdditionalItems');
    }
  ),

  /**
    Table columns related to current model projection.

    @property columns
    @type Object[]
    @readOnly
  */
  _columns: Ember.A(),

  _userSettings: Ember.computed(function() {
    return this._getUserSettings();
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
    @default true
  */
  immediateDelete: true,

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
    List of component names, which can overflow table cell.

    @property overflowedComponents
    @type Array
    @default Ember.A(['flexberry-dropdown', 'flexberry-lookup'])
  */
  overflowedComponents: Ember.A(['flexberry-dropdown', 'flexberry-lookup']),

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

  showConfigDialog: 'showConfigDialog',

  _sortingChanged: false,

  sortingChanged: Ember.observer('_sortingChanged', function() {
    let columns = this.get('columns');

    this._setColumnsSorting(columns);
  }),

  actions: {
    /**
      Show/hide filters.

      @method actions.toggleStateFilters
    */
    toggleStateFilters() {
      this.toggleProperty('showFilters');
    },
    /**
      This action is called when user click on header.

      @method actions.headerCellClick
      @public
      @param {Object} column
      @param {jQuery.Event} e jQuery.Event by click on column.
    */
    headerCellClick(column, e) {
      if (!this.orderable || column.sortable === false) {
        return;
      }

      let action = e.ctrlKey ? 'addColumnToSorting' : 'sortByColumn';
      this.sendAction(action, column);

      let sortingChanged = this.get('_sortingChanged');
      this.set('_sortingChanged', !sortingChanged);
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
      if (confirmDeleteRow) {
        Ember.assert('Error: confirmDeleteRow must be a function.', typeof confirmDeleteRow === 'function');
        if (!confirmDeleteRow()) {
          return;
        }
      }

      this._deleteRecord(recordWithKey.data, this.get('immediateDelete'));
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
      Handles action from object-list-view when no handler for this component is defined.

      @method actions.refresh
      @public
    */
    refresh() {
      this.get('objectlistviewEventsService').refreshListTrigger(this.get('componentName'));
    },

    /**
      Handles action from object-list-view when no handler for this component is defined.

      @method actions.createNew
      @public
    */
    createNew() {
      let editFormRoute = this.get('editFormRoute');
      Ember.assert('Property editFormRoute is not defined in controller', editFormRoute);
      let currentController = this.get('currentController');
      this.get('objectlistviewEventsService').setLoadingState('loading');
      Ember.run.later((function() {
        currentController.transitionToRoute(editFormRoute + '.new');
      }), 50);
    },

    /**
      Delete selected rows.

      @method actions.delete
      @public
    */
    delete() {
      let confirmDeleteRows = this.get('confirmDeleteRows');
      if (confirmDeleteRows) {
        Ember.assert('Error: confirmDeleteRows must be a function.', typeof confirmDeleteRows === 'function');
        if (!confirmDeleteRows()) {
          return;
        }
      }

      let componentName = this.get('componentName');

      if (!this.get('allSelect'))
      {
        this.get('objectlistviewEventsService').deleteRowsTrigger(componentName, true);
      } else {
        let modelName = this.get('modelProjection.modelName');

        let filterQuery = {
          predicate: this.get('currentController.filtersPredicate'),
          modelName: modelName
        };

        this.get('objectlistviewEventsService').deleteAllRowsTrigger(componentName, filterQuery);
      }
    },

    /**
      Filters the content by "Filter by any match" field value.

      @method actions.filterByAnyMatch
      @public
    */
    filterByAnyMatch(event) {
      if (!event || event.key === 'Enter') {
        let componentName = this.get('componentName');
        let filterByAnyMatchText = this.$('.block-action-input input').val();
        this.get('objectlistviewEventsService').filterByAnyMatchTrigger(componentName, filterByAnyMatchText);
      }
    },

    /**
      Remove filter from url.

      @method actions.removeFilter
      @public
    */
    removeFilter() {
      let _this = this;

      Ember.run.later((function() {
        _this.set('filterText', null);
        _this.set('filterByAnyMatchText', null);
        _this.$('.block-action-input input').val('');
      }), 50);
    },

    /**
      Action for custom button.

      @method actions.customButtonAction
      @public
      @param {String} actionName The name of action
    */
    customButtonAction(actionName) {
      this.sendAction(actionName);
    },

    /**
      Action to show confis dialog.

      @method actions.showConfigDialog
      @public
    */
    showConfigDialog(settingName) {
      Ember.assert('showConfigDialog:: componentName is not defined in flexberry-objectlistview component', this.componentName);
      this.get('currentController').send('showConfigDialog', this.componentName, settingName);
    },

    /**
      Action to show export dialog.

      @method actions.showExportDialog
      @public
    */
    showExportDialog(settingName, immediateExport) {
      let settName = settingName ? 'ExportExcel/' + settingName : settingName;
      Ember.assert('showExportDialog:: componentName is not defined in flexberry-objectlistview component', this.componentName);
      this.get('currentController').send('showConfigDialog', this.componentName, settName, true, immediateExport);
    },

    /**
      Handler click on flexberry-menu.

      @method actions.onMenuItemClick
      @public
      @param {jQuery.Event} e jQuery.Event by click on menu item
    */
    onMenuItemClick(e) {
      let iTags = Ember.$(e.currentTarget).find('i');
      let namedSettingSpans = Ember.$(e.currentTarget).find('span');
      if (iTags.length <= 0 || namedSettingSpans.length <= 0) {
        return;
      }

      this._router = getOwner(this).lookup('router:main');
      let className = iTags.get(0).className;
      let namedSetting = namedSettingSpans.get(0).innerText;
      let componentName  =  this.componentName;
      let userSettingsService = this.get('userSettingsService');

      switch (className) {
        case 'table icon':
          this.send('showConfigDialog');
          break;
        case 'checkmark box icon':

          //TODO move this code and  _getSavePromise@addon/components/colsconfig-dialog-content.js to addon/components/colsconfig-dialog-content.js
          let colsConfig = this.listNamedUserSettings[namedSetting];
          userSettingsService.saveUserSetting(this.componentName, undefined, colsConfig).
            then(record => {
              if (this._router.location.location.href.indexOf('sort=') >= 0) { // sort parameter exist in URL (ugly - TODO find sort in query parameters)
                this._router.router.transitionTo(this._router.currentRouteName, { queryParams: { sort: null, perPage: colsConfig.perPage || 5 } }); // Show page without sort parameters
              } else {
                this._router.router.transitionTo(this._router.currentRouteName, { queryParams: { perPage: colsConfig.perPage || 5 } });  //Reload current page and records (model) list
              }
            });
          break;
        case 'setting icon':
          this.send('showConfigDialog', namedSetting);
          break;
        case 'remove icon':
          userSettingsService.deleteUserSetting(componentName, namedSetting)
          .then(result => {
            this.get('colsConfigMenu').deleteNamedSettingTrigger(namedSetting);
            alert('Настройка ' + namedSetting + ' удалена');
          });
          break;
        case 'remove circle icon':
          if (!userSettingsService.haveDefaultUserSetting(componentName)) {
            alert('No default usersettings');
            break;
          }

          let defaultDeveloperUserSetting = userSettingsService.getDefaultDeveloperUserSetting(componentName);
          userSettingsService.saveUserSetting(componentName, undefined, defaultDeveloperUserSetting).then(() => {
            let sort = serializeSortingParam(defaultDeveloperUserSetting.sorting);
            this._router.router.transitionTo(this._router.currentRouteName, { queryParams: { sort: sort, perPage: 5 } });
          });
          break;
        case 'unhide icon':
          let currentUserSetting = userSettingsService.getListCurrentUserSetting(this.componentName);
          let caption = this.get('i18n').t('components.olv-toolbar.show-setting-caption') + this._router.currentPath + '.js';
          this.showInfoModalDialog(caption, JSON.stringify(currentUserSetting, undefined, '  '));
          break;
      }
    },

    /**
      Handler click on flexberry-menu.

      @method actions.onExportMenuItemClick
      @public
      @param {jQuery.Event} e jQuery.Event by click on menu item
    */
    onExportMenuItemClick(e) {
      let iTags = Ember.$(e.currentTarget).find('i');
      let namedSettingSpans = Ember.$(e.currentTarget).find('span');
      if (iTags.length <= 0 || namedSettingSpans.length <= 0) {
        return;
      }

      this._router = getOwner(this).lookup('router:main');
      let className = iTags.get(0).className;
      let namedSetting = namedSettingSpans.get(0).innerText;
      let componentName  =  this.componentName;
      let userSettingsService = this.get('userSettingsService');

      switch (className) {
        case 'file excel outline icon':
          this.send('showExportDialog');
          break;
        case 'checkmark box icon':
          this.send('showExportDialog', namedSetting, true);
          break;
        case 'setting icon':
          this.send('showExportDialog', namedSetting);
          break;
        case 'remove icon':
          userSettingsService.deleteUserSetting(componentName, namedSetting, true)
          .then(result => {
            this.get('colsConfigMenu').deleteNamedSettingTrigger(namedSetting);
            alert('Настройка ' + namedSetting + ' удалена');
          });
          break;
      }
    },

    copyJSONContent(event) {
      let infoModalDialog = this.get('_infoModalDialog');
      infoModalDialog.find('.olv-toolbar-info-modal-dialog-content textarea').select();
      let copied = document.execCommand('copy');
      let oLVToolbarInfoCopyButton = infoModalDialog.find('.olv-toolbar-info-modal-dialog-copy-button');
      oLVToolbarInfoCopyButton.get(0).innerHTML = this.get('i18n').t(copied ? 'components.olv-toolbar.copied' : 'components.olv-toolbar.ctrlc');
      oLVToolbarInfoCopyButton.addClass('disabled');
    },

    /**
      Redirect action from FlexberryLookupComponent in the controller.

      @method actions.showLookupDialog
      @param {Object} chooseData
    */
    showLookupDialog(chooseData) {
      this.get('currentController').send('showLookupDialog', chooseData);
    },

    /**
      Redirect action from FlexberryLookupComponent in the controller.

      @method actions.removeLookupValue
      @param {Object} removeData
    */
    removeLookupValue(removeData) {
      this.get('currentController').send('removeLookupValue', removeData);
    },

    /**
      This action is called when click check all at page button.

      @method actions.checkAllAtPage
      @public
      @param {jQuery.Event} e jQuery.Event by click on check all at page buttons
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

      this._router = Ember.getOwner(this).lookup('router:main');

      let defaultDeveloperUserSetting = userSettingsService.getDefaultDeveloperUserSetting(componentName);
      let currentUserSetting = userSettingsService.getCurrentUserSetting(componentName);
      currentUserSetting.sorting = defaultDeveloperUserSetting.sorting;
      userSettingsService.saveUserSetting(componentName, undefined, currentUserSetting)
      .then(record => {
        let sort = serializeSortingParam(currentUserSetting.sorting);
        this._router.router.transitionTo(this._router.currentRouteName, { queryParams: { sort: sort } });
      });
    }
  },

  /**
    An overridable method called when objects are instantiated.
    For more information see [init](http://emberjs.com/api/classes/Ember.View.html#method_init) method of [Ember.View](http://emberjs.com/api/classes/Ember.View.html).
  */
  init() {
    this._super(...arguments);
    Ember.assert('ObjectListView must have componentName attribute.', this.get('componentName'));

    this.set('selectedRecords', Ember.A());

    let searchForContentChange = this.get('searchForContentChange');
    if (searchForContentChange) {
      this.addObserver('content.[]', this, this._contentDidChange);
    }

    this.get('objectlistviewEventsService').on('olvAddRow', this, this._addRow);
    this.get('objectlistviewEventsService').on('olvDeleteRows', this, this._deleteRows);
    this.get('objectlistviewEventsService').on('olvDeleteAllRows', this, this._deleteAllRows);
    this.get('objectlistviewEventsService').on('filterByAnyMatch', this, this._filterByAnyMatch);
    this.get('objectlistviewEventsService').on('refreshList', this, this._refreshList);
    this.get('objectlistviewEventsService').on('olvRowSelected', this, this._rowSelected);
    this.get('objectlistviewEventsService').on('olvRowsDeleted', this, this._rowsDeleted);
    this.get('objectlistviewEventsService').on('resetFilters', this, this._resetColumnFilters);
    this.get('objectlistviewEventsService').on('updateWidth', this, this.setColumnWidths);
    this.get('objectlistviewEventsService').on('updateSelectAll', this, this._selectAll);

    this.get('colsConfigMenu').on('updateNamedSetting', this, this._updateListNamedUserSettings);
    this.get('colsConfigMenu').on('addNamedSetting', this, this.__addNamedSetting);
    this.get('colsConfigMenu').on('deleteNamedSetting', this, this._deleteNamedSetting);

    let projection = this.get('modelProjection');

    if (!projection) {
      throw new Error('Property \'modelProjection\' is undefined.');
    }

    let cols = this._generateColumns(projection.attributes);
    if (cols) {
      this.set('columns', cols);
    }
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
      this._setMenuWidth();
    }
  },

  /**
    Called when the element of the view has been inserted into the DOM or after the view was re-rendered.
    For more information see [didInsertElement](http://emberjs.com/api/classes/Ember.Component.html#event_didInsertElement) event of [Ember.Component](http://emberjs.com/api/classes/Ember.Component.html).
  */
  didInsertElement() {
    this._super(...arguments);
    let infoModalDialog = this.$('.olv-toolbar-info-modal-dialog');
    infoModalDialog.modal('setting', 'closable', true);
    this.set('_infoModalDialog', infoModalDialog);
    Ember.$(window).bind(`resize.${this.get('componentName')}`, Ember.$.proxy(function() {
      if (this.get('columnsWidthAutoresize')) {
        this._setColumnWidths();
      } else {
        this._setMenuWidth();
      }
    }, this));

    if (this.rowClickable) {
      let key = this._getModelKey(this.selectedRecord);
      if (key) {
        this._setActiveRecord(key);
      }
    }
  },

  /**
    Called after a component has been rendered, both on initial render and in subsequent rerenders.
    For more information see [didRender](http://emberjs.com/api/classes/Ember.Component.html#method_didRender) method of [Ember.Component](http://emberjs.com/api/classes/Ember.Component.html).
  */
  didRender() {
    this._super(...arguments);

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

    if (this.rowClickable) {
      let key = this._getModelKey(this.selectedRecord);
      if (key) {
        this._setActiveRecord(key);
      }
    }

    this._setColumnWidths();

    this.$('.object-list-view-menu > .ui.dropdown').dropdown();
    Ember.$('.object-list-view-menu:last .ui.dropdown').addClass('bottom');

    this._setCurrentColumnsWidth();
    if (this.get('fixedHeader')) {
      let $currentTable = this.$('table.object-list-view');
      $currentTable.parent().addClass('fixed-header');

      this._fixedTableHead($currentTable);
    }
  },

  /**
    Override to implement teardown.
    For more information see [willDestroy](http://emberjs.com/api/classes/Ember.Component.html#method_willDestroy) method of [Ember.Component](http://emberjs.com/api/classes/Ember.Component.html).
  */
  willDestroy() {
    this.removeObserver('content.[]', this, this._contentDidChange);

    this.get('objectlistviewEventsService').off('olvAddRow', this, this._addRow);
    this.get('objectlistviewEventsService').off('olvDeleteRows', this, this._deleteRows);
    this.get('objectlistviewEventsService').off('olvDeleteAllRows', this, this._deleteAllRows);
    this.get('objectlistviewEventsService').off('filterByAnyMatch', this, this._filterByAnyMatch);
    this.get('objectlistviewEventsService').off('refreshList', this, this._refreshList);
    this.get('objectlistviewEventsService').off('olvRowSelected', this, this._rowSelected);
    this.get('objectlistviewEventsService').off('olvRowsDeleted', this, this._rowsDeleted);
    this.get('objectlistviewEventsService').off('resetFilters', this, this._resetColumnFilters);
    this.get('objectlistviewEventsService').off('updateWidth', this, this.setColumnWidths);
    this.get('objectlistviewEventsService').off('updateSelectAll', this, this._selectAll);
    this.get('colsConfigMenu').off('updateNamedSetting', this, this._updateListNamedUserSettings);
    this.get('colsConfigMenu').off('addNamedSetting', this, this.__addNamedSetting);
    this.get('colsConfigMenu').off('deleteNamedSetting', this, this._deleteNamedSetting);

    this.get('objectlistviewEventsService').clearSelectedRecords(this.get('componentName'));

    this._super(...arguments);
  },

  /**
    Called when the element of the view is going to be destroyed.
    For more information see [willDestroyElement](http://emberjs.com/api/classes/Ember.Component.html#event_willDestroyElement) event of [Ember.Component](http://emberjs.com/api/classes/Ember.Component.html).
  */
  willDestroyElement() {
    this._super(...arguments);

    Ember.$(window).unbind(`resize.${this.get('componentName')}`);
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
      let $table = this.$('table.object-list-view');
      if (!$table) {
        // Table will not rendered yet.
        return;
      }

      let $columns = $table.find('th');

      if (this.get('allowColumnResize')) {
        $table.addClass('fixed');
        this._reinitResizablePlugin();
      } else {
        $table.colResizable({ disable: true });
      }

      let userSettings = this.get('_userSettings');

      let userSetting = !userSettings || (userSettings && !Ember.isArray(userSettings.columnWidths)) ?  Ember.A() : Ember.A(userSettings.columnWidths);
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
      let widthCondition = columnsWidthAutoresize && containerWidth > tableWidth;
      $table.css({ 'width': (columnsWidthAutoresize ? containerWidth : tableWidth) + 'px' });
      this._setMenuWidth(tableWidth, containerWidth);
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

  _setColumnsUserSettings() {
    this._setColumnsOrder();
    this._setColumnsSorting();
    this._setColumnWidths();
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
    Table columns related to current model projection.

    @property columns
    @type Object[]
    @readOnly
  */
  columns: Ember.computed('modelProjection', 'enableFilters', 'columns.@each.index', {
    get(key) {
      return this.get('_columns');
    },
    set(key, value) {
      this.set('_columns', value);
      return value;
    }
  }),

  _setColumnsOrder() {
    let columns = this.get('columns');
    let order = this.get('_userSettings.colsOrder');
    if (columns && order) {
      order.forEach((item, index) => {
        columns.forEach((column) => {
          if (column.get('propName') === item.propName) {
            column.set('hide', item.hide);
            column.set('index', index);
          }
        });
      });
      columns.sort((a, b) => (a.index > b.index ? 1 : -1));
    }
  },

  _setColumnsSorting() {
    let columns = this.get('columns');
    if (!columns) {
      return;
    }

    let userSettings = this.get('_userSettings');
    if (userSettings && userSettings.sorting === undefined) {
      userSettings.sorting = [];
    }

    columns.forEach((cols) => {
      let sorted = { sorted: false, sortNumber: 0, sortAscending: false };
      userSettings.sorting.forEach((sort, index) => {
        if (cols.propName === sort.propName) {
          sorted.sorted = true;
          sorted.sortNumber = index + 1;
          sorted.sortAscending = sort.direction === 'asc' ? true : false;
        }
      });

      cols.setProperties(sorted);
    });
  },

  _resetColumnFilters(componentName) {
    if (this.get('componentName') === componentName) {
      let columns = this.get('columns');
      if (!columns) {
        return;
      }

      columns.forEach((column) => {
        column.set('filter.pattern', null);
        column.set('filter.condition', null);
      });
    }
  },

  _getUserSettings() {
    if (this.get('notUseUserSettings')) {
      // flexberry-groupedit and lookup-dialog-content set this flag to true and use only developerUserSettings.
      // In future release backend can save userSettings for each olv.
      let userSettings = this.get('currentController.developerUserSettings');
      return userSettings ||
        userSettings ? userSettings[this.get('componentName')] : undefined ||
        userSettings ? userSettings.DEFAULT : undefined;
    } else {
      return this.get('userSettingsService').getCurrentUserSetting(this.componentName);
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
    this.get('userSettingsService').setCurrentColumnWidths(this.componentName, undefined, userWidthSettings);
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

      this.set('currentController.currentColumnsWidths', currentWidths);
    }
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
    // to avoid 'Ember.Object.create no longer supports defining methods that call _super' error,
    // if controller's 'getCellComponent' method call its super method from the base controller.
    let currentController = this.get('currentController');
    let getCellComponent = Ember.get(currentController || {}, 'getCellComponent');
    let cellComponent = this.get('cellComponent');

    if (!this.get('editOnSeparateRoute') && Ember.typeOf(getCellComponent) === 'function') {
      let recordModel = Ember.isNone(this.get('content')) ? null : this.get('content.type');
      cellComponent = getCellComponent.call(currentController, attr, bindingPath, recordModel);
    }

    let key = this._createKey(bindingPath);
    let valueFromLocales = getValueFromLocales(this.get('i18n'), key);
    let index = Ember.get(attr, 'options.index');

    let column = Ember.Object.create({
      header: valueFromLocales || attr.caption || Ember.String.capitalize(attrName),
      propName: bindingPath, // TODO: rename column.propName
      cellComponent: cellComponent,
      index: index,
    });

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
      column.set('sorted', true);
      column.set('sortAscending', sortDef.sortAscending);
      column.set('sortNumber', sortDef.sortNumber);
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
      Ember.assert(`Need function in 'componentForFilter'.`, typeof componentForFilter === 'function');
      Ember.$.extend(true, component, componentForFilter(attribute.type, relation, attribute));
    }

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
      modelName = this.get('modelName');
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
    @param {Boolean} relation
    @return {Object} Object with parameters for component.
  */
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

      case 'string':
        component.name = 'flexberry-textbox';
        component.properties = Ember.$.extend(true, component.properties, {
          class: 'compact fluid',
        });
        break;

      case 'number':
        component.name = 'flexberry-textbox';
        component.properties = Ember.$.extend(true, component.properties, {
          class: 'compact fluid',
        });
        break;

      case 'boolean':
        component.name = 'flexberry-dropdown';
        component.properties = Ember.$.extend(true, component.properties, {
          items: ['true', 'false'],
          class: 'compact fluid',
        });
        break;

      case 'date':
        component.name = 'flexberry-textbox';
        break;

      default:
        let transformInstance = Ember.getOwner(this).lookup('transform:' + type);
        let transformClass = !Ember.isNone(transformInstance) ? transformInstance.constructor : null;
        if (transformClass && transformClass.isEnum) {
          component.name = 'flexberry-dropdown';
          component.properties = Ember.$.extend(true, component.properties, {
            items: transformInstance.get('captions'),
            class: 'compact fluid',
          });
        }

        break;
    }

    return component;
  },

  /**
    Refresh list with the entered filter.

    @method _refreshList
    @param {String} componentName
    @private
  */
  _refreshList(componentName) {
    if (this.get('componentName') === componentName) {
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
          this.sendAction('applyFilters', filters);
        } else {
          if (this.get('currentController.filters')) {
            this.get('currentController').send('resetFilters');
          } else {
            this.get('currentController').send('refreshList');
          }
        }
      } else {
        this.get('currentController').send('refreshList');
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
        let modelName = this.get('modelProjection').modelName;
        let modelToAdd = this.get('store').createRecord(modelName, {});

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
        filterQuery: filterQuery
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
    this.get('appState').loading();
    let promise = this.get('store').deleteAllRecords(modelName, filterQuery);

    promise.then((data)=> {
      if (data.deletedCount > -1) {
        this.get('appState').success();
        this.get('objectlistviewEventsService').rowsDeletedTrigger(componentName, data.deletedCount, true);
        this.get('currentController').onDeleteActionFulfilled();
        this.get('objectlistviewEventsService').refreshListTrigger(componentName);
      } else {
        this.get('appState').error();
        let errorData = {
          message: data.message
        };

        this.get('currentController').onDeleteActionRejected(errorData);
        this.get('currentController').send('handleError', errorData);
      }
    }).catch((errorData) => {
      this.get('appState').error();
      if (!Ember.isNone(errorData.status) && errorData.status === 0 && !Ember.isNone(errorData.statusText) &&  errorData.statusText === 'error') {
        // This message will be converted to corresponding localized message.
        errorData.message = 'Ember Data Request returned a 0 Payload (Empty Content-Type)';
      }

      this.get('currentController').onDeleteActionRejected(errorData);
      this.get('currentController').send('handleError', errorData);
    }).finally((data) => {
      this.get('currentController').onDeleteActionAlways(data);
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
    Handler for "Olv rows deleted" event in objectlistview.

    @method _rowsDeleted

    @param {String} componentName The name of objectlistview component
    @param {Integer} count Number of deleted records
  */
  _rowsDeleted(componentName, count) {
    if (componentName === this.get('componentName')) {
      this.set('isDeleteButtonEnabled', false);
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
    let key = this._getModelKey(record);
    this._removeModelWithKey(key);

    this._deleteHasManyRelationships(record, immediately).then(() => immediately ? record.destroyRecord().then(() => {
      this.sendAction('saveAgregator');
    }) : record.deleteRecord()).catch((reason) => {
      this.get('currentController').send('handleError', reason);
      record.rollbackAll();
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
      this.sendAction('filterByAnyMatch', pattern, filterCondition);
    }
  },

  /**
    Set the active record.

    @method _setActiveRecord
    @private

    @param {String} key The key of record
  */
  _setActiveRecord(key) {
    let selectedRow = this._getRowByKey(key);
    this.$('tbody tr.active').removeClass('active');
    if (selectedRow) {
      selectedRow.addClass('active');
    }
  },

  // TODO: why this observer here in olv, if it is needed only for groupedit? And why there is still no group-edit component?
  // _rowsChanged: Ember.observer('content.@each.dirtyType', function() {
  //   let content = this.get('content');
  //   if (content && content.isAny('dirtyType', 'updated')) {
  //     let componentName = this.get('componentName');
  //     this.get('objectlistviewEventsService').rowsChangedTrigger(componentName);
  //   }
  // }),

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
    Flag used to display filters.

    @property showFilters
    @type Boolean
    @default false
  */
  showFilters: Ember.computed.oneWay('filters'),

  /**
    Route for edit form by click row.

    @property editFormRoute
    @type String
  */
  editFormRoute: undefined,

  /**
    Flag to use creation button at toolbar.

    @property createNewButton
    @type Boolean
    @default false
  */
  createNewButton: false,

  /**
    Flag to specify whether the create button is enabled.

    @property enableCreateNewButton
    @type Boolean
    @default true
  */
  enableCreateNewButton: true,

  /**
    Flag to use refresh button at toolbar.

    @property refreshButton
    @type Boolean
    @default false
  */
  refreshButton: false,

  /**
    Flag to use delete button at toolbar.

    @property deleteButton
    @type Boolean
    @default false
  */
  deleteButton: false,

  /**
    Flag to use colsConfigButton button at toolbar.

    @property colsConfigButton
    @type Boolean
    @default true
    @readOnly
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
    Flag to use filter button at toolbar.

    @property filterButton
    @type Boolean
    @default false
  */
  filterButton: false,

  /**
    Flag indicates whether to show button fo default sorting set.

    @property defaultSortingButton
    @type Boolean
    @default true
  */
  defaultSortingButton: true,

  /**
    Used to specify default 'filter by any match' field text.

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
    The flag to specify whether the delete button is enabled.

    @property enableDeleteButton
    @type Boolean
    @default true
  */
  enableDeleteButton: true,

  /**
    Name of action to send out, action triggered by click on user button.

    @property customButtonAction
    @type String
    @default 'customButtonAction'
  */
  customButtonAction: 'customButtonAction',

  /**
    Array of custom buttons of special structures [{ buttonName: ..., buttonAction: ..., buttonClasses: ... }, {...}, ...].

    @example
      ```
      {
        buttonName: '...', // Button displayed name.
        buttonAction: '...', // Action that is called from controller on this button click (it has to be registered at component).
        buttonClasses: '...', // Css classes for button.
        buttonTitle: '...', // Button title.
        disabled: true, // The state of the button is disabled if `true` or enabled if `false`.
      }
      ```

    @property customButtonsArray
    @type Array
  */
  customButtons: undefined,

  /**
    @property listNamedUserSettings
  */
  listNamedUserSettings: undefined,

  _listNamedUserSettings: Ember.observer('listNamedUserSettings', function() {
    let listNamedUserSettings = this.get('listNamedUserSettings');
    for (let namedSetting in listNamedUserSettings) {
      this._addNamedSetting(namedSetting);
    }

    this._sortNamedSetting();
  }),

  /**
    @property listNamedExportSettings
  */
  listNamedExportSettings: undefined,

  _listNamedExportSettings: Ember.observer('listNamedExportSettings', function() {
    let listNamedExportSettings = this.get('listNamedExportSettings');
    for (let namedSetting in listNamedExportSettings) {
      let settName = namedSetting.split('/');
      settName.shift();
      settName = settName.join('/');
      this._addNamedSetting(settName, true);
    }

    this._sortNamedSetting(true);
  }),

  /**
    @property colsConfigMenu
    @type Service
  */
  colsConfigMenu: Ember.inject.service(),

  menus: [
    { name: 'use', icon: 'checkmark box' },
    { name: 'edit', icon: 'setting' },
    { name: 'remove', icon: 'remove' }
  ],

  /**
    @property colsSettingsItems
    @readOnly
  */
  colsSettingsItems: Ember.computed('i18n.locale', 'userSettingsService.isUserSettingsServiceEnabled', function() {
      let i18n = this.get('i18n');
      let menus = [
        { icon: 'angle right icon',
          iconAlignment: 'right',
          localeKey: 'components.olv-toolbar.use-setting-title',
          items: []
        },
        { icon: 'angle right icon',
          iconAlignment: 'right',
          localeKey: 'components.olv-toolbar.edit-setting-title',
          items: []
        },
        { icon: 'angle right icon',
          iconAlignment: 'right',
          localeKey: 'components.olv-toolbar.remove-setting-title',
          items: []
        }
      ];
      let rootItem = {
        icon: 'dropdown icon',
        iconAlignment: 'right',
        title: '',
        items: [],
        localeKey: ''
      };
      let createSettitingItem = {
        icon: 'table icon',
        iconAlignment: 'left',
        title: i18n.t('components.olv-toolbar.create-setting-title'),
        localeKey: 'components.olv-toolbar.create-setting-title'
      };
      rootItem.items[rootItem.items.length] = createSettitingItem;
      rootItem.items.push(...menus);

      let setDefaultItem = {
        icon: 'remove circle icon',
        iconAlignment: 'left',
        title: i18n.t('components.olv-toolbar.set-default-setting-title'),
        localeKey: 'components.olv-toolbar.set-default-setting-title'
      };
      rootItem.items[rootItem.items.length] = setDefaultItem;
      if (this.get('colsConfigMenu').environment && this.get('colsConfigMenu').environment === 'development') {
        let showDefaultItem = {
          icon: 'unhide icon',
          iconAlignment: 'left',
          title: i18n.t('components.olv-toolbar.show-default-setting-title'),
          localeKey: 'components.olv-toolbar.show-default-setting-title'
        };
        rootItem.items[rootItem.items.length] = showDefaultItem;
      }

      return this.get('userSettingsService').isUserSettingsServiceEnabled ? [rootItem] : [];
    }
  ),

  /**
    Observe colsSettingsItems changes.
    @property _colsSettingsItems
    @readOnly
  */
  _colsSettingsItems: Ember.observer('colsSettingsItems', function() {
    this._updateListNamedUserSettings();
  }),

  /**
    @property exportExcelItems
    @readOnly
  */
  exportExcelItems:  Ember.computed(function() {
      let i18n = this.get('i18n');
      let menus = [
        { icon: 'angle right icon',
          iconAlignment: 'right',
          localeKey: 'components.olv-toolbar.export-title',
          items: []
        },
        { icon: 'angle right icon',
          iconAlignment: 'right',
          localeKey: 'components.olv-toolbar.edit-setting-title',
          items: []
        },
        { icon: 'angle right icon',
          iconAlignment: 'right',
          localeKey: 'components.olv-toolbar.remove-setting-title',
          items: []
        }
      ];
      let rootItem = {
        icon: 'dropdown icon',
        iconAlignment: 'right',
        title: '',
        items: [],
        localeKey: ''
      };
      let createSettitingItem = {
        icon: 'file excel outline icon',
        iconAlignment: 'left',
        title: i18n.t('components.olv-toolbar.create-setting-title'),
        localeKey: 'components.olv-toolbar.create-setting-title'
      };
      rootItem.items[rootItem.items.length] = createSettitingItem;
      rootItem.items.push(...menus);

      return [rootItem];
    }
  ),

  /**
    Flag shows enable-state of delete button.
    If there are selected rows button is enabled. Otherwise - not.

    @property isDeleteButtonEnabled
    @type Boolean
    @default false
  */
  isDeleteButtonEnabled: false,

  /**
    Stores the text from "Filter by any match" input field.

    @property filterByAnyMatchText
    @type String
  */
  filterByAnyMatchText: Ember.computed.oneWay('filterText'),

  /**
    Caption to be displayed in info modal dialog.
    It will be displayed only if some info occurs.

    @property _infoModalDialogCaption
    @type String
    @default ''
    @private
  */
  _infoModalDialogCaption: '',

  /**
    Content to be displayed in info modal dialog.
    It will be displayed only if some info occurs.

    @property _infoModalDialogContent
    @type String
    @default ''
    @private
  */
  _infoModalDialogContent: '',

  /**
    Selected jQuery object, containing HTML of error modal dialog.

    @property _errorModalDialog
    @type <a href="http://api.jquery.com/Types/#jQuery">JQueryObject</a>
    @default null
    @private
  */
  _infoModalDialog: null,

  /**
   Shows info modal dialog.

    @method showInfoModalDialog
    @param {String} infoCaption Info caption (window header caption).
    @param {String} infoContent Info content (window body content).
    @returns {String} Info content.
  */
  showInfoModalDialog(infoCaption, infoContent) {
    let infoModalDialog = this.get('_infoModalDialog');
    if (infoModalDialog && infoModalDialog.modal) {
      this.set('_infoModalDialogCaption', infoCaption);
      this.set('_infoModalDialogContent', infoContent);
      infoModalDialog.modal('show');
    }

    let oLVToolbarInfoCopyButton = infoModalDialog.find('.olv-toolbar-info-modal-dialog-copy-button');
    oLVToolbarInfoCopyButton.get(0).innerHTML = this.get('i18n').t('components.olv-toolbar.copy');
    oLVToolbarInfoCopyButton.removeClass('disabled');
    return infoContent;
  },

  /**
    Event handler for "row has been selected" event in objectlistview.

    @method _rowSelected
    @private

    @param {String} componentName The name of objectlistview component
    @param {DS.Model} record The model corresponding to selected row in objectlistview
    @param {Number} count Count of selected rows in objectlistview
    @param {Boolean} checked Current state of row in objectlistview (checked or not)
    @param {Object} recordWithKey The model wrapper with additional key corresponding to selected row
  */
  _rowSelected(componentName, record, count, checked, recordWithKey) {
    if (componentName === this.get('componentName')) {
      this.set('isDeleteButtonEnabled', count > 0 && this.get('enableDeleteButton'));
    }
  },

  _updateListNamedUserSettings() {
    if (!this.get('userSettingsService').isUserSettingsServiceEnabled) {
      return;
    }

    this._resetNamedUserSettings();
    Ember.set(this, 'listNamedUserSettings', this.get('userSettingsService').getListCurrentNamedUserSetting(this.componentName));
    Ember.set(this, 'listNamedExportSettings', this.get('userSettingsService').getListCurrentNamedUserSetting(this.componentName, true));
  },

  _resetNamedUserSettings() {
    let menus = this.get('menus');
    for (let i = 0; i < menus.length; i++) {
      Ember.set(this.get('colsSettingsItems')[0].items[i + 1], 'items', []);
      Ember.set(this.get('exportExcelItems')[0].items[i + 1], 'items', []);
    }
  },

  _addNamedSetting(namedSetting, isExportExcel) {
    let menus = this.get('menus');
    for (let i = 0; i < menus.length; i++) {
      let icon = menus[i].icon + ' icon';
      let subItems = isExportExcel ? this.get('exportExcelItems')[0].items[i + 1].items :
        this.get('colsSettingsItems')[0].items[i + 1].items;
      let newSubItems = [];
      let exist = false;
      for (let j = 0; j < subItems.length; j++) {
        newSubItems[j] = subItems[j];
        if (subItems[j].title === namedSetting) {
          exist = true;
        }
      }

      if (!exist) {
        newSubItems[subItems.length] = { title: namedSetting, icon: icon, iconAlignment: 'left' };
      }

      if (isExportExcel) {
        Ember.set(this.get('exportExcelItems')[0].items[i + 1], 'items', newSubItems);
      } else {
        Ember.set(this.get('colsSettingsItems')[0].items[i + 1], 'items', newSubItems);
      }
    }

    this._sortNamedSetting(isExportExcel);
  },

  _deleteNamedSetting(namedSetting) {
    this._updateListNamedUserSettings();
  },

  _sortNamedSetting(isExportExcel) {
    for (let i = 0; i < this.menus.length; i++) {
      if (isExportExcel) {
        this.get('exportExcelItems')[0].items[i + 1].items.sort((a, b) => a.title > b.title);
      } else {
        this.get('colsSettingsItems')[0].items[i + 1].items.sort((a, b) => a.title > b.title);
      }
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
      this.set('isDeleteButtonEnabled', selectAllParameter);

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

    parent.append(table);

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
  }
});
