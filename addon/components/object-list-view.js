/**
  @module ember-flexberry
*/
import Ember from 'ember';
import FlexberryBaseComponent from './flexberry-base-component';
import FlexberryLookupCompatibleComponentMixin from '../mixins/flexberry-lookup-compatible-component';
import FlexberryFileCompatibleComponentMixin from '../mixins/flexberry-file-compatible-component';
import ErrorableControllerMixin from '../mixins/errorable-controller';
import { translationMacro as t } from 'ember-i18n';
import { getValueFromLocales } from 'ember-flexberry-data/utils/model-functions';

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
      this.set('rowsInLoadingState', false);
      this.set('contentWithKeys', Ember.A());
      this.set('contentForRender', Ember.A());
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

      // TODO: analyze this observers.
      let attrsArray = this._getAttributesName();
      content.forEach((record) => {
        attrsArray.forEach((attrName) => {
          Ember.addObserver(record, attrName, this, '_attributeChanged');
        });
      });

      this.set('showLoadingTbodyClass', false);
    } else {
      this.set('rowsInLoadingState', true);
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
    Table columns related to current model projection.

    @property columns
    @type Object[]
    @readOnly
  */
    columns: Ember.computed('modelProjection', 'enableFilters', 'content', function() {
      let ret;
      let projection = this.get('modelProjection');

      if (!projection) {
        Ember.Logger.error('Property \'modelProjection\' is undefined.');
        return [];
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
        userSettings = this.get('userSettingsService').getCurrentUserSetting(this.componentName);
      }

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
          if (this.currentController.userSettings === undefined) {
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
    Flag indicates whether some rows are not loaded yet.

    @property rowsInLoadingState
    @type Boolean
    @default false
  */
    rowsInLoadingState: false,

    /**
    Class loading for tbody.

    @property showLoadingTbodyClass
    @type Boolean
    @defaul false
  */
    showLoadingTbodyClass: false,

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

    selectedRowsChanged: Ember.observer('selectedRecords.@each', function() {
      let selectedRecords = this.get('selectedRecords');
      let configurateSelectedRows = this.get('configurateSelectedRows');
      if (configurateSelectedRows) {
        Ember.assert('configurateSelectedRows must be a function', typeof configurateSelectedRows === 'function');
        configurateSelectedRows(selectedRecords);
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
    Used to identify objectListView on the page.

    @property componentName
    @type String
    @default ''
  */
    componentName: '',

    actions: {

      /**
      This action is called when user click on row.

      @method actions.rowClick
      @public
      @param {DS.Model} recordWithKey A record with key
      @param {jQuery.Event} e jQuery.Event by click on row
    */
      rowClick(recordWithKey, e) {
        let editOnSeparateRoute = this.get('editOnSeparateRoute');
        if (this.get('readonly')) {
          if (!editOnSeparateRoute) {
            return;
          }
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
            readonly: this.get('readonly')
          });
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
        if (!this.orderable || column.sortable === false) {
          return;
        }

        let action = e.ctrlKey ? 'addColumnToSorting' : 'sortByColumn';
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
        this.get('objectlistviewEventsService').rowSelectedTrigger(componentName, recordWithKey.data, selectedRecords.length, e.checked);
      }
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
            let hierarchicalAttribute = hierarchicalrelationships[0].name;
            this.sendAction('availableHierarchicalMode', hierarchicalAttribute);
          }
        }
      }

      this.set('selectedRecords', Ember.A());

      let searchForContentChange = this.get('searchForContentChange');
      if (searchForContentChange) {
        this.addObserver('content.[]', this, this._contentDidChange);
      }

      this.get('objectlistviewEventsService').on('olvAddRow', this, this._addRow);
      this.get('objectlistviewEventsService').on('olvDeleteRows', this, this._deleteRows);
      this.get('objectlistviewEventsService').on('filterByAnyMatch', this, this._filterByAnyMatch);
      this.get('objectlistviewEventsService').on('refreshList', this, this._refreshList);

      let eventsBus = this.get('eventsBus');
      if (eventsBus) {
        eventsBus.on('showLoadingTbodyClass', (componentName, showLoadingTbodyClass) => {
          if (componentName === this.get('componentName')) {
            this.set('showLoadingTbodyClass', showLoadingTbodyClass);
          }
        });
      }
    },

    /**
    Called when the element of the view has been inserted into the DOM or after the view was re-rendered.
    For more information see [didInsertElement](http://emberjs.com/api/classes/Ember.Component.html#event_didInsertElement) event of [Ember.Component](http://emberjs.com/api/classes/Ember.Component.html).
  */
    didInsertElement() {
      this._super(...arguments);

      if (this.rowClickable) {
        let key = this._getModelKey(this.selectedRecord);
        if (key) {
          this._setActiveRecord(key);
        }
      }

      let columnWidth;
      if (this.notUseUserSettings) {
        columnWidth = this.get('currentController.developerUserSettings');
        columnWidth = columnWidth ? columnWidth[this.get('componentName')] : undefined;
        columnWidth = columnWidth ? columnWidth.DEFAULT : undefined;
        columnWidth = columnWidth ? columnWidth.columnWidths : undefined;
      } else {
        columnWidth = this.get('userSettingsService').getCurrentColumnWidths(this.componentName);
      }

      if (columnWidth !== undefined) {
        this._setColumnWidths(columnWidth);
      }

      // TODO: resolve this problem.
      this.$('.flexberry-dropdown:last').dropdown({
        direction: 'upward'
      });

      // TODO: the last menu needs will be up.
      Ember.$('.object-list-view-menu:last .ui.dropdown').addClass('bottom');
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
              this.$('.object-list-view-menu > .ui.dropdown').dropdown();

              // The last menu needs will be up.
              Ember.$('.object-list-view-menu:last .ui.dropdown').addClass('bottom');

              // Remove long loading spinners.
              this.set('rowByRowLoadingProgress', false);
              this.set('showLoadingTbodyClass', false);

              this.set('_renderedRowIndex', -1);

              if (this.rowClickable) {
                let key = this._getModelKey(this.selectedRecord);
                if (key) {
                  this._setActiveRecord(key);
                }
              }

              let columnWidth;
              if (this.notUseUserSettings) {
                columnWidth = this.get('currentController.developerUserSettings');
                columnWidth = columnWidth ? columnWidth[this.get('componentName')] : undefined;
                columnWidth = columnWidth ? columnWidth.DEFAULT : undefined;
                columnWidth = columnWidth ? columnWidth.columnWidths : undefined;
              } else {
                columnWidth = this.get('userSettingsService').getCurrentColumnWidths(this.componentName);
              }

              if (columnWidth !== undefined) {
                this._setColumnWidths(columnWidth);
              }

              let $currentTable = this.$('table.object-list-view');
              if (this.get('allowColumnResize')) {
                $currentTable.addClass('fixed');
                this._reinitResizablePlugin();
              } else {
                $currentTable.colResizable({ disable: true });
              }
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
            }
          }
        }
      } else {

        if (!this._colResizableInit) {
          let $currentTable = this.$('table.object-list-view');
          if (this.get('allowColumnResize')) {
            $currentTable.addClass('fixed');
            this._reinitResizablePlugin();
          } else {
            $currentTable.colResizable({ disable: true });
          }

          this.set('_colResizableInit', true);
        }

        this.$('.object-list-view-menu > .ui.dropdown').dropdown();
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
      this.get('objectlistviewEventsService').off('filterByAnyMatch', this, this._filterByAnyMatch);
      this.get('objectlistviewEventsService').off('refreshList', this, this._refreshList);

      this._super(...arguments);

      let content = this.get('content');
      let attrsArray = this._getAttributesName();

      content.forEach((record) => {
        attrsArray.forEach((attrName) => {
          Ember.removeObserver(record, attrName, this, '_attributeChanged');
        });
      });
    },

    /**
    Called when the element of the view is going to be destroyed.
    For more information see [willDestroyElement](http://emberjs.com/api/classes/Ember.Component.html#event_willDestroyElement) event of [Ember.Component](http://emberjs.com/api/classes/Ember.Component.html).
  */
    willDestroyElement() {
      this._super(...arguments);

      let eventsBus = this.get('eventsBus');
      if (eventsBus) {
        eventsBus.off('showLoadingTbodyClass');
      }
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

      $currentTable.colResizable({
        minWidth: 50,
        resizeMode: 'flex',
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
          propName: undefined,
          width: undefined
        }, item);

        let propName = userColumnInfo.propName;
        let width = userColumnInfo.width;

        Ember.assert('Property name is not defined at saved user setting.', propName);
        Ember.assert('Column width is not defined at saved user setting.', width !== undefined);

        hashedUserSetting[propName] = width;
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
          propName: currentPropertyName,
          width: currentColumnWidth,
        });
      });
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
              let column = this._createColumn(attr, attrName, bindingPath);

              if (column.cellComponent.componentName === undefined) {
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
            let column = this._createColumn(attr, attrName, bindingPath);
            columnsBuf.push(column);
            break;

          default:
            Ember.Logger.error(`Unknown kind of projection attribute: ${attr.kind}`);
        }
      }

      return columnsBuf;
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
        key = 'models.' + mainModelName + '.projections.' + mainModelProjection.projectionName + '.' + nameRelationship + '.' + bindingPath + '.caption';
      } else {
        key = 'models.' + modelName + '.projections.' + projection.projectionName + '.' + bindingPath + '.caption';
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
        let recordModel =  (this.get('content') || {}).type || null;
        cellComponent = getCellComponent.call(currentController, attr, bindingPath, recordModel);
      }

      let key = this._createKey(bindingPath);
      let valueFromLocales = getValueFromLocales(this.get('i18n'), key);

      let column = {
        header: valueFromLocales || attr.caption || Ember.String.capitalize(attrName),
        propName: bindingPath, // TODO: rename column.propName
        cellComponent: cellComponent,
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
      let component = this._getFilterComponent(attribute.type, relation);
      let componentForFilter = this.get('componentForFilter');
      if (componentForFilter) {
        Ember.assert(`Need function in 'componentForFilter'.`, typeof componentForFilter === 'function');
        Ember.$.extend(true, component, componentForFilter(attribute.type, relation));
      }

      let conditions;
      let conditionsByType = this.get('conditionsByType');
      if (conditionsByType) {
        Ember.assert(`Need function in 'conditionsByType'.`, typeof conditionsByType === 'function');
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
        case 'number':
          return ['eq', 'neq', 'le', 'ge'];

        case 'string':
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
    _getFilterComponent(type, relation) {
      let component = {
        name: undefined,
        properties: undefined,
      };

      switch (type) {
        case 'file':
          break;

        case 'string':
          component.name = 'flexberry-textbox';
          component.properties = {
            class: 'compact fluid',
          };
          break;

        case 'number':
          component.name = 'flexberry-textbox';
          component.properties = {
            class: 'compact fluid',
          };
          break;

        case 'boolean':
          component.name = 'flexberry-dropdown';
          component.properties = {
            items: ['true', 'false'],
            class: 'compact fluid',
          };
          break;

        case 'date':
          component.name = 'flexberry-textbox';
          break;

        default:
          let transformInstance = Ember.getOwner(this).lookup('transform:' + type);
          let transformClass = !Ember.isNone(transformInstance) ? transformInstance.constructor : null;
          if (transformClass && transformClass.isEnum) {
            component.name = 'flexberry-dropdown';
            component.properties = {
              items: transformInstance.get('captions'),
              class: 'compact fluid',
            };
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
            if (column.filter.pattern && column.filter.condition) {
              hasFilters = true;
              filters[column.filter.name] = column.filter;
            }
          });

          if (hasFilters) {
            this.sendAction('applyFilters', filters);
          } else {
            this.get('currentController').send('refreshList');
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
          let modelName = this.get('modelProjection').modelName;
          let modelToAdd = this.get('store').createRecord(modelName, {});

          this._addModel(modelToAdd);
          this.get('content').addObject(modelToAdd);
          this.get('objectlistviewEventsService').rowAddedTrigger(componentName, modelToAdd);

          let attrsArray = this._getAttributesName();
          attrsArray.forEach((attrName) => {
            Ember.addObserver(modelToAdd, attrName, this, '_attributeChanged');
          });
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
        this.send('dismissErrorMessages');
        let selectedRecords = this.get('selectedRecords');
        let count = selectedRecords.length;
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

      this._deleteHasManyRelationships(record, immediately).then(() => immediately ? record.destroyRecord().then(() => {
        this.sendAction('saveAgregator');
      }) : record.deleteRecord()).catch((reason) => {
        this.rejectError(reason, `Unable to delete a record: ${record.toString()}.`);
        record.rollbackAll();
      });

      let componentName = this.get('componentName');
      this.get('objectlistviewEventsService').rowDeletedTrigger(componentName, record, immediately);

      let attrsArray = this._getAttributesName();
      attrsArray.forEach((attrName) => {
        Ember.removeObserver(record, attrName, this, '_attributeChanged');
      });
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
      if (selectedRow) {
        selectedRow.addClass('active');
      }
    },

    // TODO: why this observer here in olv, if it is needed only for groupedit? And why there is still no group-edit component?
    _rowsChanged: Ember.observer('content.@each.dirtyType', function() {
      let content = this.get('content');
      if (content && content.isAny('dirtyType', 'updated')) {
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
    That observer is called when change attributes of model.

    @method _attributeChanged
    @private
  */
    _attributeChanged(record, attrName) {
      let rowConfig = record.get('rowConfig');
      let configurateRow = this.get('configurateRow');
      if (configurateRow) {
        Ember.assert('configurateRow must be a function', typeof configurateRow === 'function');
        configurateRow(rowConfig, record);
      }
    },
  });
