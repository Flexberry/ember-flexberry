/**
 * @module ember-flexberry
 */

import Ember from 'ember';
import FlexberryBaseComponent from './flexberry-base-component';
import FlexberryLookupCompatibleComponentMixin from '../mixins/flexberry-lookup-compatible-component';
import ErrorableMixin from '../mixins/errorable-controller';

/**
 * Object list view component.
 *
 * @class ObjectListView
 * @extends FlexberryBaseComponent
 */
export default FlexberryBaseComponent.extend(FlexberryLookupCompatibleComponentMixin, ErrorableMixin, {
  actions: {
    rowClick: function(key, record) {
      if (this.get('readonly')) {
        return;
      }

      if (this.rowClickable) {
        let editOnSeparateRoute = this.get('editOnSeparateRoute');
        if (!editOnSeparateRoute) {
          // It is necessary only when we will not go to other route on click.
          this.set('selectedRecord', record);
          this._setActiveRecord(key);
        }

        this.sendAction('action', record, {
          saveBeforeRouteLeave: this.get('saveBeforeRouteLeave'),
          editOnSeparateRoute: editOnSeparateRoute,
          modelName: this.get('modelProjection').modelName,
          detailArray: this.get('content')
        });
      }
    },

    headerCellClick: function(column, event) {
      if (!this.headerClickable || column.sortable === false) {
        return;
      }

      var action = event.ctrlKey ? 'addColumnToSorting' : 'sortByColumn';
      this.sendAction(action, column);
    },

    // TODO: rename recordWithKey. rename record in the template, where it is actually recordWithKey.
    deleteRow: function(recordWithKey) {
      if (this.get('readonly') || !recordWithKey.config.canBeDeleted) {
        return;
      }

      if (confirm('Do you really want to delete this record?')) {
        this._deleteRecord(recordWithKey.data, this.get('immediateDelete'));
      }
    },

    selectRow: function(key, record, e) {
      var selectedRecords = this.get('selectedRecords');
      var selectedRow = this._getRowByKey(key);

      if (e.checked) {
        if (!selectedRow.hasClass('active')) {
          selectedRow.addClass('active');
        }

        if (selectedRecords.indexOf(record) === -1) {
          selectedRecords.pushObject(record);
        }
      } else {
        if (selectedRow.hasClass('active')) {
          selectedRow.removeClass('active');
        }

        selectedRecords.removeObject(record);
      }

      var componentName = this.get('componentName');
      this.get('objectlistviewEventsService').rowSelectedTrigger(componentName, record, selectedRecords.length);
    },

    menuInRowItemClick: function(key, record, e) {
      if (this.get('readonly')) {
        return;
      }

      if (e.item.isDeleteItem) {
        this.send('deleteRow', key, record);
        return;
      }

      if (e.item.isEditItem) {
        this.send('rowClick', key, record);
        return;
      }

      // Call onClick handler if it is specified in the given menu item.
      if (e.item && Ember.typeOf(e.item.onClick) === 'function') {
        e.modelKey = key;
        e.model = record;

        e.item.onClick.call(e.currentTarget, e);
      }
    }
  },

  /**
   * Table row click action name.
   *
   * @property action
   * @type String
   * @default 'rowClick'
   * @readonly
   */
  action: 'rowClick',

  /**
   * Flag: indicates wether allow to resize columns (if `true`) or not (if `false`).
   *
   * @property allowColumnResize
   * @type Boolean
   * @default true
   */
  allowColumnResize: true,

  /**
   * Table add column to sorting action name.
   *
   * @property addColumnToSorting
   * @type String
   * @default 'addColumnToSorting'
   * @readonly
   */
  addColumnToSorting: 'addColumnToSorting',

  /**
   * Table sort by column action name.
   *
   * @property sortByColumn
   * @type String
   * @default 'sortByColumn'
   * @readonly
   */
  sortByColumn: 'sortByColumn',

  /**
   * Override wrapping element's tag.
   */
  tagName: 'div',

  /**
   * Component's CSS classes.
   */
  classNames: ['object-list-view-container'],

  /**
   * Path to component's settings in application configuration (JSON from ./config/environment.js).
   *
   * @property appConfigSettingsPath
   * @type String
   * @default 'APP.components.flexberryBaseComponent'
   */
  appConfigSettingsPath: 'APP.components.objectListView',

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

  emptyMobileHeader: Ember.computed('singleColumnHeaderTitle', function() {
    let singleColumnHeaderTitle = this.get('singleColumnHeaderTitle');
    return Ember.isEmpty(singleColumnHeaderTitle);
  }),

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
   * Flag: indicates whether to show helper column or not.
   *
   * @property showHelperColumn
   * @type Boolean
   * @readonly
   */
  showHelperColumn: Ember.computed('showAsteriskInRow', 'showCheckBoxInRow', 'showDeleteButtonInRow', function() {
    return this.get('showAsteriskInRow') || this.get('showCheckBoxInRow') || this.get('showDeleteButtonInRow');
  }),

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
   * Name of user setting name for column widths.
   *
   * @property _columnWidthsUserSettingName
   * @private
   *
   * @type String
   * @default `OlvColumnWidths`
   */
  _columnWidthsUserSettingName: 'OlvColumnWidths',

  /**
   * Service to work with user settings on server.
   *
   * @property _userSettingsService
   * @private
   *
   * @type Service
   */
  _userSettingsService: Ember.inject.service('user-settings-service'),

  /**
   * Flag: indicates whether additional menu items for dropdown menu in last column of every row are defined.
   *
   * @property menuInRowHasAdditionalItems
   * @type Boolean
   * @readonly
   */
  menuInRowHasAdditionalItems: Ember.computed('menuInRowAdditionalItems.[]', function() {
    var menuInRowAdditionalItems = this.get('menuInRowAdditionalItems');
    return Ember.isArray(menuInRowAdditionalItems) && menuInRowAdditionalItems.length > 0;
  }),

  /**
   * Flag: indicates whether to show menu column or not.
   *
   * @property showMenuColumn
   * @type Boolean
   * @readonly
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
   * Menu items for dropdown menu in last column of every row.
   *
   * @property menuInRowItems
   * @type Object[]
   * @readonly
   */
  menuInRowItems: Ember.computed(
    'showEditMenuItemInRow',
    'showDeleteMenuItemInRow',
    'menuInRowHasAdditionalItems',
    function() {
      var menuInRowSubItems = [];
      if (this.get('showEditMenuItemInRow')) {
        menuInRowSubItems.push({
          icon: 'edit icon',
          title: this.get('i18n').t('object-list-view.menu-in-row.edit-menu-item-title') || 'Edit record',
          isEditItem: true
        });
      }

      if (this.get('showDeleteMenuItemInRow')) {
        menuInRowSubItems.push({
          icon: 'trash icon',
          title: this.get('i18n').t('object-list-view.menu-in-row.delete-menu-item-title') || 'Delete record',
          isDeleteItem: true
        });
      }

      if (this.get('menuInRowHasAdditionalItems')) {
        menuInRowSubItems.push(...this.get('menuInRowAdditionalItems'));
      }

      return [{
        icon: 'list layout icon',
        itemsAlignment: 'left',
        items: menuInRowSubItems
      }];
    }
  ),

  /**
   * Model projection which should be used to display given content.
   *
   * @property modelProjection
   * @type Object
   * @default null
   */
  modelProjection: null,

  /**
   * Table columns related to current model projection.
   *
   * @property columns
   * @type Object[]
   * @readonly
   */
  columns: Ember.computed('modelProjection', function() {
    var projection = this.get('modelProjection');
    if (!projection) {
      throw new Error('No projection was defined.');
    }

    let cols = this._generateColumns(projection.attributes);
    return cols;
  }),

  /**
   * Total columns count (including additional columns).
   *
   * @property columnsCount
   * @type Number
   * @readonly
   */
  colspan: Ember.computed('columns.length', 'useSingleColumn', 'showHelperColumn', 'showMenuColumn', function() {
    var columnsCount = 0;
    if (this.get('showHelperColumn')) {
      columnsCount += 1;
    }

    if (this.get('showMenuColumn')) {
      columnsCount += 1;
    }

    if (this.get('useSingleColumn')) {
      columnsCount += 1;
    } else {
      var columns = this.get('columns');
      columnsCount += Ember.isArray(columns) ? columns.length : 0;
    }

    return columnsCount;
  }),

  /**
   * Flag: indicates whether some column contains editable component instead of default cellComponent.
   * @property hasEditableValues
   * @type Boolean
   * @readonly
   */
  hasEditableValues: Ember.computed('columns.[]', 'columns.@each.cellComponent.componentName', function() {
    var columns = this.get('columns');
    if (!Ember.isArray(columns)) {
      return true;
    }

    var defaultCellCompoinentName = this.get('cellComponent.componentName');
    return columns.filter(function(column) {
      return column.cellComponent.componentName !== defaultCellCompoinentName;
    }).length > 0;
  }),

  /**
   * Content to be displayed (models collection).
   *
   * @property content
   * @type ManyArray
   * @default null
   */
  content: null,

  /**
   * Array of models from content collection with some synthetic keys related to them.
   *
   * @property contentWithKeys
   * @type Object[]
   * @default null
   */
  contentWithKeys: null,

  /**
   * Flag indicates whether content is defined.
   *
   * @property hasContent
   * @type Boolean
   * @readonly
   */
  hasContent: Ember.computed('contentWithKeys.length', function() {
    return this.get('contentWithKeys.length') > 0;
  }),

  /**
   * Message to be displayed in table body, if content is not defined or empty.
   *
   * @property noDataMessage
   * @type String
   */
  noDataMessage: undefined,

  /**
   * Flag: indicates whether table rows are clickable.
   *
   * @property rowClickable
   * @type Boolean
   * @default true
   */
  rowClickable: true,

  /**
   * Flag: indicates whether table headers are clickable.
   *
   * @property headerClickable
   * @type Boolean
   * @default false
   */
  headerClickable: false,

  /**
   * Dictionary with sorting data related to columns.
   *
   * @property sorting
   * @type Object
   */
  sorting: null,

  /**
   * Last selected record.
   *
   * @property selectedRecord
   * @type DS.Model
   */
  selectedRecord: null,

  /**
   * All selected records.
   *
   * @property selectedRecords
   * @type DS.Model[]
   */
  selectedRecords: null,

  /**
   * Custom attributes which will be added to each generated column.
   *
   * @property customColumnAttributes
   * @type Object
   */
  customColumnAttributes: null,

  /**
   * Filter setting.
   *
   * @property filterByAnyMatch
   * @type String
   * @default 'filterByAnyMatch'
   */
  filterByAnyMatch: 'filterByAnyMatch',

  /**
   * Hook for configurate rows.
   *
    Example:
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
        configurateRow: function(rowConfig, record) {
          rowConfig.canBeDeleted = false;
        }
      }
    });
    ```
   * @method configurateRow
   * @param {Object} config Settings for row.
                            See {{#crossLink "ObjectListView/defaultRowConfig:property"}}{{/crossLink}}
                            property for details.
   * @param {DS.Model} record The record in row.
   */
  configurateRow: undefined,

  /**
   * Default settings for rows.
   *
   * @property defaultRowConfig
   * @type Object
   * @param {Boolean} [canBeDeleted=true] The row can be deleted.
   * @param {Boolean} [canBeSelected=true] The row can be selected via checkbox.
   */
  defaultRowConfig: {
    canBeDeleted: true,
    canBeSelected: true
  },

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
   * @type Object
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
  saveBeforeRouteLeave: false,

  /**
   * Ember data store.
   *
   * @property store
   * @type Service
   */
  store: Ember.inject.service('store'),

  /**
   * Service that triggers objectlistview events.
   *
   * @property objectlistviewEventsService
   * @type Service
   */
  objectlistviewEventsService: Ember.inject.service('objectlistview-events'),

  /**
   * Initializes component.
   */
  init: function() {
    this._super(...arguments);

    this.set('selectedRecords', Ember.A());
    this.set('contentWithKeys', Ember.A());

    this.get('objectlistviewEventsService').on('olvAddRow', this, this._addRow);
    this.get('objectlistviewEventsService').on('olvDeleteRows', this, this._deleteRows);
    this.get('objectlistviewEventsService').on('filterByAnyMatch', this, this._filterByAnyMatch);

    this.initProperty({
      propertyName: 'noDataMessage',
      defaultValue: this.get('i18n').t('object-list-view.no-data-text') || 'No data'
    });

    if (this.get('content')) {
      this.get('content').forEach((item, index, enumerable) => {
        this._addModel(item);
      });
    }
  },

  /**
   * Destroys component.
   */
  willDestroy: function() {
    this.get('objectlistviewEventsService').off('olvAddRow', this, this._addRow);
    this.get('objectlistviewEventsService').off('olvDeleteRows', this, this._deleteRows);

    this._super(...arguments);
  },

  /**
   * Initializes component's DOM-related logic.
   */
  didInsertElement: function() {
    this._super(...arguments);

    if (!(this.get('showCheckBoxInRow') || this.get('showDeleteButtonInRow'))) {
      this.$('thead tr th:eq(1)').css('border-left', 'none');
      this.$('tbody tr').find('td:eq(1)').css('border-left', 'none');
    }

    if (this.rowClickable) {
      var key = this._getModelKey(this.selectedRecord);
      if (key) {
        this._setActiveRecord(key);
      }
    }

    // TODO: add projectionName to projection.
    let projection = this.get('modelProjection');
    let projectionName = undefined;
    let userSetting = {
      moduleName: projectionName,
      settingName: this.get('_columnWidthsUserSettingName')
    };

    let getSettingPromise = this.get('_userSettingsService').getUserSetting(userSetting);
    let _this = this;
    getSettingPromise.done(function(data, textStatus, jqXHR) {
      _this._setColumnWidths(_this, data);
    });
  },

  /**
   * This hook is called during both render and re-render after the template has rendered and the DOM updated.
   * Plugins (such as plugin for column resize) are initialized here.
   *
   * @method didRender
   */
  didRender: function() {
    this._super(...arguments);
    if (this.get('allowColumnResize')) {
      if (this.get('useSingleColumn')) {
        throw new Error(
          'Flags of object-list-view \'allowColumnResize\' and \'useSingleColumn\' ' +
          'can\'t be enabled at the same time.');
      }

      let currentTable = this.$('table.object-list-view');

      // The first column has semantic class "collapsing"
      // so the column has 1px width and plugin has problems.
      // A real width is reset in order to keep computed by semantic width.
      Ember.$.each(this.$('th', currentTable), function (key, item) {
        let curWidth = Ember.$(item).width();
        Ember.$(item).width(curWidth);
      });

      // Disable plugin and then init it again.
      currentTable.colResizable({ disable: true });

      let _this = this;
      currentTable.colResizable({
        onResize: function(e) {
          // Save column width as user setting on resize.
          _this._afterColumnResize(_this, e);
        }
      });
    }
  },

  /**
   * It handles the end of getting user setting with column widths.
   *
   * @method _setColumnWidths
   * @private
   *
   * @param {ObjectListView} currentContext Current context of execution.
   * @param {Array} userSetting User setting to apply to control.
   */
  _setColumnWidths: function(currentContext, userSetting) {
    if (!Ember.isArray(userSetting)) {
      return;
    }

    let hashedUserSetting = {};
    userSetting.forEach(function(item) {
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

    let columns = currentContext.$('table.object-list-view').find('th');
    Ember.$.each(columns, function (key, item) {
      let currentItem = currentContext.$(item);
      let currentPropertyName = currentContext._getColumnPropertyName(currentContext, currentItem);
      Ember.assert('Column property name is not defined', currentPropertyName);

      let savedColumnWidth = hashedUserSetting[currentPropertyName];
      if (savedColumnWidth) {
        currentItem.width(savedColumnWidth);
      }
    });
  },

  /**
   * It handles the end of column resize.
   * New column widths are send to user settings service for saving.
   *
   * @method _afterColumnResize
   * @private
   *
   * @param {ObjectListView} currentContext Current context of execution.
   * @param {Object} eventParams Parameters of the end of column resizing.
   */
  _afterColumnResize: function(currentContext, eventParams) {
    // Send info to service with user settings.
    let userWidthSettings = [];
    let columns = currentContext.$(eventParams.currentTarget).find('th');
    Ember.$.each(columns, function (key, item) {
      let currentItem = currentContext.$(item);
      let currentPropertyName = currentContext._getColumnPropertyName(currentContext, currentItem);
      Ember.assert('Column property name is not defined', currentPropertyName);

      // There can be fractional values potentially.
      let currentColumnWidth = currentItem.width();
      currentColumnWidth = Math.round(currentColumnWidth);

      userWidthSettings.push({
        propertyName: currentPropertyName,
        width: currentColumnWidth
      });
    });

    // TODO: add projectionName to projection.
    let projection = currentContext.get('modelProjection');
    let projectionName = undefined;
    let userSetting = {
      moduleName: projectionName,
      userSetting: userWidthSettings,
      settingName: this.get('_columnWidthsUserSettingName')
    };

    this.get('_userSettingsService').saveUserSetting(userSetting);
  },

  /**
   * This method returns property name for column.
   * Property name is got from atribute `data-olv-header-property-name` of column header.
   * If property name won't be found, exeption will be thrown.
   *
   * @method _getColumnPropertyName
   * @private
   *
   * @param {ObjectListView} currentContext Current context of execution.
   * @param {Object} currentItem Current column header to get property name from.
   * @return {String} Corresponding property name for column.
   */
  _getColumnPropertyName: function(currentContext, currentItem) {
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
   * Destroys component's DOM-related logic.
   */
  willDestroyElement: function() {
    this._super(...arguments);
  },

  _generateColumns: function(attributes, columnsBuf, relationshipPath) {
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
            if (attr.options.displayMemberPath) {
              bindingPath += '.' + attr.options.displayMemberPath;
            } else {
              bindingPath += '.id';
            }

            let column = this._createColumn(attr, bindingPath);
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
          throw new Error(`Unknown kind of projection attribute: ${attr.kind}`);
      }
    }

    return columnsBuf;
  },

  _createColumn: function(attr, bindingPath) {
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
      cellComponent: cellComponent
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

  _getRowByKey: function(key) {
    var _this = this;
    var row = null;
    this.$('tbody tr').each(function() {
      var currentKey = _this.$(this).find('td:eq(0) div:eq(0)').text().trim();
      if (currentKey === key) {
        row = _this.$(this);
        return false;
      }
    });
    return row;
  },

  _getModelKey: function(record) {
    var modelWithKeyItem = this.get('contentWithKeys').findBy('data', record);
    return modelWithKeyItem ? modelWithKeyItem.key : null;
  },

  _removeModelWithKey(key) {
    var itemToRemove = this.get('contentWithKeys').findBy('key', key);
    if (itemToRemove) {
      this.get('contentWithKeys').removeObject(itemToRemove);
    }
  },

  /**
   * Adds detail model to current model, generates unique key for detail model.
   * If record is deleted then `undefined` is returned and record isn't added to list.
   *
   * @method _addModel
   * @private
   *
   * @param {DS.Model} record Detail model to add to current model.
   * @return {String} Unique key for added record or `undefined` if record is deleted.
   */
  _addModel: function(record) {
    if (record.get('isDeleted')) {
      return undefined;
    }

    var modelWithKey = Ember.Object.create({});
    var key = Ember.guidFor(record);

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
   * Adds row to component and calls click on row action if detail is edited on separate route.
   * This method is triggered on toolbar's add batton click.
   *
   * @method _addRow
   * @private
   *
   * @param {String} componentName The name of triggered component.
   */
  _addRow: function(componentName) {
    if (componentName === this.get('componentName')) {
      if (this.get('editOnSeparateRoute')) {
        // Depending on settings current model has to be saved before adding detail.
        this.send(this.get('action'), undefined, undefined);
      } else {
        var modelName = this.get('modelProjection').modelName;
        var modelToAdd = this.get('store').createRecord(modelName, {});
        this.get('content').addObject(modelToAdd);

        this._addModel(modelToAdd);
        this.get('objectlistviewEventsService').rowAddedTrigger(componentName, modelToAdd);
      }
    }
  },

  /**
   * Handler for "delete selected rows" event in objectlistview.
   *
   * @method _deleteRows
   *
   * @param {String} componentName The name of objectlistview component.
   * @param {Boolean} immediately Flag to delete record immediately.
   */
  _deleteRows: function(componentName, immediately) {
    if (componentName === this.get('componentName')) {
      if (confirm('Do you really want to delete selected records?')) {
        this.send('dismissErrorMessages');

        var _this = this;
        var selectedRecords = this.get('selectedRecords');
        var count = selectedRecords.length;
        selectedRecords.forEach(function(item, index, enumerable) {
          Ember.run.once(this, function() {
            _this._deleteRecord(item, immediately);
          });
        }, this);

        selectedRecords.clear();
        this.get('objectlistviewEventsService').rowsDeletedTrigger(componentName, count);
      }
    }
  },

  /**
   * Hook that executes before deleting the record.
   *
   *  Example:
   *  ```handlebars
   *  <!-- app/templates/employees.hbs -->
   *  {{flexberry-objectlistview
   *    ...
   *    beforeDeleteRecord=(action 'beforeDeleteRecord')
   *    ...
   *  }}
   *  ```
   *
   *  ```js
   *  // app/controllers/employees.js
   *  import ListFormController from './list-form';
   *
   *  export default ListFormController.extend({
   *    actions: {
   *      beforeDeleteRecord: function(record, data) {
   *        if (record.get('myProperty')) {
   *          data.cancel = true;
   *        }
   *      }
   *    }
   *  });
   *  ```
   *
   * @method beforeDeleteRecord
   *
   * @param {DS.Model} record Deleting record.
   * @param {Object} data Metadata.
   * @param {Boolean} [data.cancel=false] Flag for canceling deletion.
   * @param {Boolean} [data.immediately] See {{#crossLink "ObjectListView/immediateDelete:property"}}{{/crossLink}}
   *                                     property for details.
   */
  beforeDeleteRecord: null,

  _deleteRecord: function(record, immediately) {
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

    var key = this._getModelKey(record);
    this._removeModelWithKey(key);

    this._deleteHasManyRelationships(record, immediately).then(() => {
      return immediately ? record.destroyRecord() : record.deleteRecord();
    }).catch((reason) => {
      this.rejectError(reason, `Unable to delete a record: ${record.toString()}.`);
      record.rollbackAttributes();
    });

    var componentName = this.get('componentName');
    this.get('objectlistviewEventsService').rowDeletedTrigger(componentName, record, immediately);
  },

  /**
   * Delete all hasMany relationships in the `record`.
   *
   * @method _deleteHasManyRelationships
   * @private
   *
   * @param {DS.Model} record A record with relationships to delete.
   * @param {Boolean} immediately If `true`, relationships have been destroyed (delete and save).
   * @return {Promise} A promise that will be resolved when relationships have been deleted.
   */
  _deleteHasManyRelationships: function(record, immediately) {
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
   * The handler for "filter by any match" event triggered in objectlistview events service.
   *
   * @method _filterByAnyMatch
   * @private
   *
   * @param {String} pattern The pattern to filter objects.
   */
  _filterByAnyMatch: function(componentName, pattern) {
    this.sendAction('filterByAnyMatch', pattern);
  },

  _setActiveRecord: function(key) {
    var selectedRow = this._getRowByKey(key);
    this.$('tbody tr.active').removeClass('active');
    selectedRow.addClass('active');
  },

  // TODO: why this observer here in olv, if it is needed only for groupedit? And why there is still no group-edit component?
  _rowsChanged: Ember.observer('content.@each.dirtyType', function() {
    let content = this.get('content');
    if (content && content.isAny('dirtyType', 'updated')) {
      var componentName = this.get('componentName');
      this.get('objectlistviewEventsService').rowsChangedTrigger(componentName);
    }
  })
});
