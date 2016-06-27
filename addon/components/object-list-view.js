/**
  @module ember-flexberry
*/
import Ember from 'ember';
import FlexberryBaseComponent from './flexberry-base-component';
import FlexberryLookupCompatibleComponentMixin from '../mixins/flexberry-lookup-compatible-component';
import FlexberryFileCompatibleComponentMixin from '../mixins/flexberry-file-compatible-component';
import ErrorableControllerMixin from '../mixins/errorable-controller';
import { translationMacro as t } from 'ember-i18n';

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
  FlexberryFileCompatibleComponentMixin,
  ErrorableControllerMixin, {
  /**
    Computed property forms unique name for component from model name and current route.
    This unique name can be used as module name for user settings service.

    @property _moduleName
    @private
    @type String
  */
  _moduleName: Ember.computed('modelProjection', function() {
    let modelName = this.get('modelProjection').modelName;
    let currentController = this.get('currentController');
    let currentRoute = currentController ? this.get('currentController').get('target').currentRouteName : 'application';
    Ember.assert('Error while module name determing.', modelName && currentRoute);

    return modelName + '__' + currentRoute;
  }),

  /**
    Name of user setting name for column widths.

    @property _columnWidthsUserSettingName
    @private
    @type String
    @default 'OlvColumnWidths'
  */
  _columnWidthsUserSettingName: 'OlvColumnWidths',

  /**
    Service to work with user settings on server.

    @property _userSettingsService
    @private
    @type Service
  */
  _userSettingsService: Ember.inject.service('user-settings-service'),

  /**
    Override wrapping element's tag.
  */
  tagName: 'div',

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
    Classes for table.

    @property tableClass
    @type String
    @readOnly
  */
  tableClass: Ember.computed('tableStriped', 'rowClickable', 'customTableClass', function() {
    let tableStriped = this.get('tableStriped');
    let rowClickable = this.get('rowClickable');
    let classes = this.get('customTableClass');

    if (tableStriped) {
      classes += ' striped';
    }

    if (rowClickable) {
      classes += ' selectable';
    }

    return classes;
  }),

  /**
    Path to component's settings in application configuration (JSON from ./config/environment.js).

    @property appConfigSettingsPath
    @type String
    @default 'APP.components.flexberryBaseComponent'
  */
  appConfigSettingsPath: 'APP.components.objectListView',

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
    Default cell component that will be used to display values in single column.

    @property {Object} singleColumnCellComponent
    @property {String} [singleColumnCellComponent.componentName='object-list-view-single-column-cell']
    @property {String} [singleColumnCellComponent.componentProperties=null]
  */
  singleColumnCellComponent: {
    componentName: 'object-list-view-single-column-cell',
    componentProperties: null,
  },

  /**
    Flag indicates whether to use single column to display all model properties or not.

    @property useSingleColumn
    @type Boolean
    @default false
  */
  useSingleColumn: false,

  /**
    Header title of single column.

    @property singleColumnHeaderTitle
    @type String
  */
  singleColumnHeaderTitle: undefined,

  /**
    Flag indicates whether to show mobile header is empty or not.

    @property emptyMobileHeader
    @type Boolean
    @readOnly
  */
  emptyMobileHeader: Ember.computed('singleColumnHeaderTitle', function() {
    let singleColumnHeaderTitle = this.get('singleColumnHeaderTitle');
    return Ember.isEmpty(singleColumnHeaderTitle);
  }),

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
    Flag indicates whether to show helper column or not.

    @property showHelperColumn
    @type Boolean
    @readOnly
  */
  showHelperColumn: Ember.computed(
    'showAsteriskInRow',
    'showCheckBoxInRow',
    'showDeleteButtonInRow',
    'modelProjection',
    function() {
    if (this.get('modelProjection')) {
      return this.get('showAsteriskInRow') || this.get('showCheckBoxInRow') || this.get('showDeleteButtonInRow');
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

  /**
    Table columns related to current model projection.

    @property columns
    @type Object[]
    @readOnly
  */
  columns: Ember.computed('modelProjection', function() {
    let ret;
    let projection = this.get('modelProjection');
    if (!projection) {
      Ember.Logger.error('Property \'modelProjection\' is undefined.');
      return [];
    }

    let cols = this._generateColumns(projection.attributes);
    if ('caption' in projection) {
      // If ObjectListView is defined in flexberry-groupedit dont implement userSettings
      // This can be determined by presence of caption property in modelProjection
      return cols;
    }

    var userSettings = this.currentController ? this.currentController.userSettings : undefined;
    if (userSettings && userSettings.colsOrder !== undefined) {
      let namedCols = {};
      for (let i = 0; i < cols.length; i++) {
        let col = cols[i];
        delete col.sorted;
        delete col.sortNumber;
        delete col.sortAscending;
        let propName = col.propName;
        namedCols[propName] = col;
      }

      if (userSettings.sorting === undefined) {
        userSettings.sorting = [];
      }

      for (let i = 0; i < userSettings.sorting.length; i++) {
        let sorting = userSettings.sorting[i];
        let propName = sorting.propName;
        namedCols[propName].sorted = true;
        namedCols[propName].sortAscending = sorting.direction === 'asc' ? true : false;
        namedCols[propName].sortNumber = i + 1;
      }

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
      if (this.currentController) {
        if (userSettings === undefined) {
          Ember.set(this.currentController, 'userSettings', {});
        }

        Ember.set(this.currentController.userSettings, 'colsOrder', cols);
      }

      ret = cols;
    }

    return ret;
  }),

  /**
    Total columns count (including additional columns).

    @property columnsCount
    @type Number
    @readOnly
  */
  colspan: Ember.computed('columns.length', 'useSingleColumn', 'showHelperColumn', 'showMenuColumn', function() {
    let columnsCount = 0;
    if (this.get('showHelperColumn')) {
      columnsCount += 1;
    }

    if (this.get('showMenuColumn')) {
      columnsCount += 1;
    }

    if (this.get('useSingleColumn')) {
      columnsCount += 1;
    } else {
      let columns = this.get('columns');
      columnsCount += Ember.isArray(columns) ? columns.length : 0;
    }

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

    @property headerClickable
    @type Boolean
    @default false
  */
  headerClickable: false,

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
        configurateRow=(action 'configurateRow')
        ...
      }}
      ```

      ```js
      // app/controllers/employees.js
      import ListFormController from './list-form';

      export default ListFormController.extend({
        actions: {
          configurateRow(rowConfig, record) {
            rowConfig.canBeDeleted = false;
            if (record.get('isMyFavoriteRecord')) {
              rowConfig.customClass += 'my-fav-record';
            }
          }
        }
      });
      ```
    @method configurateRow

    @param {Object} config Settings for row.
                            See {{#crossLink "ObjectListView/defaultRowConfig:property"}}{{/crossLink}}
                            property for details
    @param {DS.Model} record The record in row
  */
  configurateRow: undefined,

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
    Hook that can be used to confirm delete row.

    @example
      ```handlebars
      <!-- app/templates/your-template.hbs -->
      {{flexberry-objectlistview
        ...
        confirmDeleteRow=(action 'confirmDeleteRow')
        ...
      }}
      ```

      ```js
      // app/controllers/your-controller.js
      ...
      actions: {
        ...
        confirmDeleteRow(row) {
          return confirm('You sure?');
        }
        ...
      }
      ...
      ```

    @method confirmDeleteRow
    @param {Object} row Row
    @return {Boolean} If `true` then delete row else cancel delete
  */
  confirmDeleteRow: null,

  /**
    Hook that can be used to confirm delete rows.

    @example
      ```handlebars
      <!-- app/templates/your-template.hbs -->
      {{flexberry-objectlistview
        ...
        confirmDeleteRows=(action 'confirmDeleteRows')
        ...
      }}
      ```

      ```js
      // app/controllers/your-controller.js
      ...
      actions: {
        ...
        confirmDeleteRows(selectedRows) {
          if (selectedRows.length < 5) {
            return confirm('You sure?');
          } else {
            return true;
          }
        }
        ...
      }
      ...
      ```

    @method confirmDeleteRows
    @param {Array} selectedRows Selected rows
    @return {Boolean} If `true` then delete selected rows else cancel delete
  */
  confirmDeleteRows: null,

  actions: {
    /**
      This action is called when user click on row.

      @method actions.rowClick
      @public
      @param {DS.Model} recordWithKey A record with key
      @param {jQuery.Event} e jQuery.Event by click on row
    */
    rowClick(recordWithKey, e) {
      if (this.get('readonly')) {
        return;
      }

      if (this.rowClickable) {
        let editOnSeparateRoute = this.get('editOnSeparateRoute');
        if (!editOnSeparateRoute) {
          // It is necessary only when we will not go to other route on click.
          this.set('selectedRecord', recordWithKey.data);
          this._setActiveRecord(recordWithKey.key);
        }

        this.sendAction('action', recordWithKey ? recordWithKey.data : undefined, {
          saveBeforeRouteLeave: this.get('saveBeforeRouteLeave'),
          editOnSeparateRoute: editOnSeparateRoute,
          modelName: this.get('modelProjection').modelName,
          detailArray: this.get('content'),
        });
      }
    },

    /**
      This action is called when user click on header.

      @method actions.headerCellClick
      @public
      @param {} column
      @param {jQuery.Event} e jQuery.Event by click on colomn
    */
    headerCellClick(column, e) {
      if (!this.headerClickable || column.sortable === false) {
        return;
      }

      let action = event.ctrlKey ? 'addColumnToSorting' : 'sortByColumn';
      this.sendAction(action, column);
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
      if (this.get('readonly') || !recordWithKey.config.canBeDeleted) {
        return;
      }

      let confirmDeleteRow = this.get('confirmDeleteRow');
      if (confirmDeleteRow) {
        Ember.assert('Error: confirmDeleteRow must be a function.', typeof confirmDeleteRow === 'function');
        if (!confirmDeleteRow(recordWithKey.data)) {
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
      this.get('objectlistviewEventsService').rowSelectedTrigger(componentName, recordWithKey.data, selectedRecords.length, e.checked);
    },

    /**
      Configurate items menu in row.

      @method actions.menuInRowConfigurateItems
      @public
      @param {DS.Model} recordWithKey A record with key
      @param {Object} menuItems Menu items in row
    */
    menuInRowConfigurateItems(recordWithKey, menuItems) {
      let menuInRowSubItems = [];
      if (this.get('showEditMenuItemInRow') && recordWithKey.config.canBeSelected) {
        menuInRowSubItems.push({
          icon: 'edit icon',
          title: this.get('i18n').t('object-list-view.menu-in-row.edit-menu-item-title') || 'Edit record',
          isEditItem: true,
        });
      }

      if (this.get('showDeleteMenuItemInRow') && recordWithKey.config.canBeDeleted) {
        menuInRowSubItems.push({
          icon: 'trash icon',
          title: this.get('i18n').t('object-list-view.menu-in-row.delete-menu-item-title') || 'Delete record',
          isDeleteItem: true,
        });
      }

      if (this.get('menuInRowHasAdditionalItems')) {
        menuInRowSubItems.push(...this.get('menuInRowAdditionalItems'));
      }

      menuItems.push({
        icon: 'list layout icon',
        itemsAlignment: 'left',
        items: menuInRowSubItems,
      });
    },

    /**
      This action is called when user click on item menu.

      @method actions.menuInRowItemClick
      @public
      @param {DS.Model} recordWithKey A record with key
      @param {jQuery.Event} e jQuery.Event by click on item menu
    */
    menuInRowItemClick(recordWithKey, e) {
      if (this.get('readonly')) {
        return;
      }

      if (e.item.isDeleteItem) {
        this.send('deleteRow', recordWithKey);
        return;
      }

      if (e.item.isEditItem) {
        this.send('rowClick', recordWithKey);
        return;
      }

      // Call onClick handler if it is specified in the given menu item.
      if (e.item && Ember.typeOf(e.item.onClick) === 'function') {
        e.modelKey = recordWithKey.key;
        e.model = recordWithKey.data;

        e.item.onClick.call(e.currentTarget, e);
      }
    }
  },

  /**
    An overridable method called when objects are instantiated.
    For more information see [init](http://emberjs.com/api/classes/Ember.View.html#method_init) method of [Ember.View](http://emberjs.com/api/classes/Ember.View.html).
   */
  init() {
    this._super(...arguments);

    this.set('selectedRecords', Ember.A());
    this.set('contentWithKeys', Ember.A());

    this.get('objectlistviewEventsService').on('olvAddRow', this, this._addRow);
    this.get('objectlistviewEventsService').on('olvDeleteRows', this, this._deleteRows);
    this.get('objectlistviewEventsService').on('filterByAnyMatch', this, this._filterByAnyMatch);

    let content = this.get('content');
    if (content) {
      if (content.get('isFulfilled') === false) {
        content.then((items) => {
          items.forEach((item) => {
            this._addModel(item);
          });
        });
      } else {
        content.forEach((item) => {
          this._addModel(item);
        });
      }
    }
  },

  /**
    Called when the element of the view has been inserted into the DOM or after the view was re-rendered.
    For more information see [didInsertElement](http://emberjs.com/api/classes/Ember.Component.html#event_didInsertElement) event of [Ember.Component](http://emberjs.com/api/classes/Ember.Component.html).
  */
  didInsertElement() {
    this._super(...arguments);

    if (!(this.get('showCheckBoxInRow') || this.get('showDeleteButtonInRow'))) {
      this.$('thead tr th:eq(1)').css('border-left', 'none');
      this.$('tbody tr').find('td:eq(1)').css('border-left', 'none');
    }

    if (this.rowClickable) {
      let key = this._getModelKey(this.selectedRecord);
      if (key) {
        this._setActiveRecord(key);
      }
    }

    let moduleName = this.get('_moduleName');
    let userSetting = {
      moduleName: moduleName,
      settingName: this.get('_columnWidthsUserSettingName')
    };

    let getSettingPromise = this.get('_userSettingsService').getUserSetting(userSetting);
    getSettingPromise.then(data => {
      this._setColumnWidths(data);
    });

    // TODO: resolv this problem.
    this.$('.flexberry-dropdown:last').dropdown({
      direction: 'upward'
    });
  },

  /**
    Called after a component has been rendered, both on initial render and in subsequent rerenders.
    For more information see [didRender](http://emberjs.com/api/classes/Ember.Component.html#method_didRender) method of [Ember.Component](http://emberjs.com/api/classes/Ember.Component.html).
  */
  didRender() {
    this._super(...arguments);

    let currentTable = this.$('table.object-list-view');

    if (this.get('allowColumnResize')) {
      if (this.get('useSingleColumn')) {
        Ember.Logger.error(
          'Flags of object-list-view \'allowColumnResize\' and \'useSingleColumn\' ' +
          'can\'t be enabled at the same time.');
        return;
      }

      // The first column has semantic class "collapsing"
      // so the column has 1px width and plugin has problems.
      // A real width is reset in order to keep computed by semantic width.
      Ember.$.each(this.$('th', $currentTable), (key, item) => {
        let curWidth = Ember.$(item).width();
        Ember.$(item).width(curWidth);
      });

      $currentTable.addClass('fixed');

      this._reinitResizablePlugin();
    } else {
      currentTable.colResizable({ disable: true });
    }
  },

  /**
    Override to implement teardown.
    For more information see [willDestroy](http://emberjs.com/api/classes/Ember.Component.html#method_willDestroy) method of [Ember.Component](http://emberjs.com/api/classes/Ember.Component.html).
  */
  willDestroy() {
    this.get('objectlistviewEventsService').off('olvAddRow', this, this._addRow);
    this.get('objectlistviewEventsService').off('olvDeleteRows', this, this._deleteRows);
    this.get('objectlistviewEventsService').off('filterByAnyMatch', this, this._filterByAnyMatch);

    this._super(...arguments);
  },

  /**
    Called when the element of the view is going to be destroyed.
    For more information see [willDestroyElement](http://emberjs.com/api/classes/Ember.Component.html#event_willDestroyElement) event of [Ember.Component](http://emberjs.com/api/classes/Ember.Component.html).
  */
  willDestroyElement() {
    this._super(...arguments);
  },

  /**
    It reinits plugin for column resize.
    Reinit is important for proper position of resize elements.

    @method _reinitResizablePlugin
    @private
  */
  _reinitResizablePlugin() {
    let $currentTable = this.$('table.object-list-view');

    // Disable plugin and then init it again.
    $currentTable.colResizable({ disable: true });

    currentTable.colResizable({
      minWidth: 90,
      resizeMode:'flex',
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
  _setColumnWidths(userSetting) {
    if (!Ember.isArray(userSetting)) {
      return;
    }

    let hashedUserSetting = {};
    userSetting.forEach(item => {
      let userColumnInfo = Ember.merge({
        propertyName: undefined,
        width: undefined
      }, item);

      let propertyName = userColumnInfo.propertyName;
      let width = userColumnInfo.width;

      Ember.assert('Property name is not defined at saved user setting.', propertyName);
      Ember.assert('Column width is not defined at saved user setting.', width);

      hashedUserSetting[propertyName] = width;
    });

    let $columns = this.$('table.object-list-view').find('th');
    Ember.$.each($columns, (key, item) => {
      let currentItem = this.$(item);
      let currentPropertyName = this._getColumnPropertyName(currentItem);
      Ember.assert('Column property name is not defined', currentPropertyName);

      let savedColumnWidth = hashedUserSetting[currentPropertyName];
      if (savedColumnWidth) {
        currentItem.width(savedColumnWidth);
      }
    });

    this._reinitResizablePlugin();
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
        propertyName: currentPropertyName,
        width: currentColumnWidth,
      });
    });

    let moduleName = this.get('_moduleName');
    let userSetting = {
      moduleName,
      userSetting: userWidthSettings,
      settingName: this.get('_columnWidthsUserSettingName'),
    };

    this.get('_userSettingsService').saveUserSetting(userSetting);
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
    columnsBuf = columnsBuf || [];
    relationshipPath = relationshipPath || '';

    for (let attrName in attributes) {
      let currentRelationshipPath = relationshipPath;
      if (!attributes.hasOwnProperty(attrName)) {
        continue;
      }

      let attr = attributes[attrName];
      switch (attr.kind) {
        case 'hasMany':
          break;

        case 'belongsTo':
          if (!attr.options.hidden) {
            let bindingPath = currentRelationshipPath + attrName;
            let column = this._createColumn(attr, bindingPath);

            if (column.cellComponent.componentName === 'object-list-view-cell') {
              if (attr.options.displayMemberPath) {
                column.propName += '.' + attr.options.displayMemberPath;
              } else {
                column.propName += '.id';
              }
            }

            columnsBuf.push(column);
          }

          currentRelationshipPath += attrName + '.';
          this._generateColumns(attr.attributes, columnsBuf, currentRelationshipPath);
          break;

        case 'attr':
          if (attr.options.hidden) {
            break;
          }

          let bindingPath = currentRelationshipPath + attrName;
          let column = this._createColumn(attr, bindingPath);
          columnsBuf.push(column);
          break;

        default:
          Ember.Logger.error(`Unknown kind of projection attribute: ${attr.kind}`);
      }
    }

    return columnsBuf;
  },

  /**
    Create the column.

    @method _createColumn
    @private
  */
  _createColumn(attr, bindingPath) {
    // We get the 'getCellComponent' function directly from the controller,
    // and do not pass this function as a component attrubute,
    // to avoid 'Ember.Object.create no longer supports defining methods that call _super' error,
    // if controller's 'getCellComponent' method call its super method from the base controller.
    let currentController = this.get('currentController');
    let getCellComponent = Ember.get(currentController || {}, 'getCellComponent');
    let cellComponent = this.get('cellComponent');

    if (!this.get('editOnSeparateRoute') && Ember.typeOf(getCellComponent) === 'function') {
      let recordModel =  (this.get('content') || {}).type || null;
      cellComponent = getCellComponent.call(currentController, attr, bindingPath, recordModel);
    }

    let column = {
      header: attr.caption,
      propName: bindingPath, // TODO: rename column.propName
      cellComponent: cellComponent,
    };

    let customColumnAttributesFunc = this.get('customColumnAttributes');
    if (customColumnAttributesFunc) {
      let customColAttr = customColumnAttributesFunc(attr, bindingPath);
      if (customColAttr && (typeof customColAttr === 'object')) {
        Ember.$.extend(true, column, customColAttr);
      }
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
    modelWithKey.set('config', rowConfig);

    let configurateRow = this.get('configurateRow');
    if (configurateRow) {
      Ember.assert('configurateRow must be a function', typeof configurateRow === 'function');
      configurateRow(rowConfig, record);
    }

    this.get('contentWithKeys').pushObject(modelWithKey);

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
        this.get('content').addObject(modelToAdd);

        this._addModel(modelToAdd);
        this.get('objectlistviewEventsService').rowAddedTrigger(componentName, modelToAdd);
      }
    }
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
      let confirmDeleteRows = this.get('confirmDeleteRows');
      if (confirmDeleteRows) {
        Ember.assert('Error: confirmDeleteRows must be a function.', typeof confirmDeleteRows === 'function');
        if (!confirmDeleteRows(selectedRecords)) {
          return;
        }
      }

      let count = selectedRecords.length;
      this.send('dismissErrorMessages');
      selectedRecords.forEach((item, index, enumerable) => {
        Ember.run.once(this, function() {
          this._deleteRecord(item, immediately);
        });
      }, this);

      selectedRecords.clear();
      this.get('objectlistviewEventsService').rowsDeletedTrigger(componentName, count);
    }
  },

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

       ```js
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

    @param {DS.Model} record Deleting record
    @param {Object} data Metadata
    @param {Boolean} [data.cancel=false] Flag for canceling deletion
    @param {Boolean} [data.immediately] See {{#crossLink "ObjectListView/immediateDelete:property"}}{{/crossLink}}
                                        property for details
  */
  beforeDeleteRecord: null,

  /**
    Delete the record.

    @method _deleteRecord
    @private

    @param {DS.Model} record A record to delete
    @param {Boolean} immediately If `true`, relationships have been destroyed (delete and save)
  */
  _deleteRecord(record, immediately) {
    let beforeDeleteRecord = this.get('beforeDeleteRecord');
    if (beforeDeleteRecord) {
      Ember.assert('beforeDeleteRecord must be a function', typeof beforeDeleteRecord === 'function');

      let data = {
        immediately: immediately,
        cancel: false
      };
      beforeDeleteRecord(record, data);

      if (data.cancel) {
        return;
      }
    }

    let key = this._getModelKey(record);
    this._removeModelWithKey(key);

    this._deleteHasManyRelationships(record, immediately).then(() => immediately ? record.destroyRecord() : record.deleteRecord()).catch((reason) => {
      this.rejectError(reason, `Unable to delete a record: ${record.toString()}.`);
      record.rollbackAttributes();
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
    this.sendAction('filterByAnyMatch', pattern);
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
    selectedRow.addClass('active');
  },

  // TODO: why this observer here in olv, if it is needed only for groupedit? And why there is still no group-edit component?
  _rowsChanged: Ember.observer('content.@each.dirtyType', function() {
    let content = this.get('content');
    if (content && content.isAny('dirtyType', 'updated')) {
      let componentName = this.get('componentName');
      this.get('objectlistviewEventsService').rowsChangedTrigger(componentName);
    }
  })
});
