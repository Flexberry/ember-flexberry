import $ from 'jquery';
import Mixin from '@ember/object/mixin';
import { inject as service } from '@ember/service';
import { inject as controller } from '@ember/controller';
import { assert } from '@ember/debug';
import { typeOf, isNone } from '@ember/utils';
import { get, set } from '@ember/object';
import { isArray, A } from '@ember/array';
import { capitalize } from '@ember/string';
import { htmlSafe } from '@ember/template';
import { getValueFromLocales } from 'ember-flexberry-data/utils/model-functions';
import getAttrLocaleKey from '../utils/get-attr-locale-key';

export default Mixin.create({
  _userSettingsService: service('user-settings'),

  /**
    Service that triggers {{#crossLink "FlexberryGroupeditComponent"}}{{/crossLink}} events.

    @property _groupEditEventsService
    @type Service
    @private
  */
    _groupEditEventsService: service('objectlistview-events'),

  /**
    Controller to show advlimit config modal window.

    @property advLimitController
    @type <a href="http://emberjs.com/api/classes/Ember.InjectedProperty.html">Ember.InjectedProperty</a>
    @default Ember.inject.controller('advlimit-dialog')
  */
  advLimitController: controller('advlimit-dialog'),

  /**
    Controller to show filters modal window.

    @property filtersDialogController
    @type <a href="http://emberjs.com/api/classes/Ember.InjectedProperty.html">Ember.InjectedProperty</a>
    @default Ember.inject.controller('filters-dialog')
  */
  filtersDialogController: controller('filters-dialog'),

  /**
    Service for managing advLimits for lists.

    @property advLimit
    @type advLimit
  */
  advLimit: service(),

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
    Columns widtghs for current component.

  @property {Object} currentColumnsWidths
*/
  currentColumnsWidths: undefined,

  actions: {
    /**
      Show columns config dialog.

      @method actions.showConfigDialog
      @param componentName Component name.
      @param settingName Setting name.
      @param useSidePageMode Indicates when use side page mode.
      @param isExportExcel Indicates if it's export excel dialog.
      @param immediateExport Indicate if auto export is needed.
    */
    showConfigDialog(componentName, settingName, useSidePageMode=false, isExportExcel = false, immediateExport = false) {
      this._showConfigDialog(componentName, settingName, useSidePageMode, this, isExportExcel, immediateExport);
    },

    /**
      Show columns config dialog for groupedit.

      @method actions.showSortGeDialog
      @param componentName Component name.
      @param useSidePageMode Indicates when use side page mode.
      @param modelProjection Model projection.
      @param geSorting Current sorting.
    */
      showSortGeDialog(componentName, useSidePageMode=true, modelProjection, geSorting) {
        this._showSortGeDialog(componentName, useSidePageMode, modelProjection, geSorting);
      },

      /**
      Show columns config dialog.

      @method actions.getGeneratedColumns
      @param componentName Component name.
      @param settingName Setting name.
      @param modelProjection Model projection.
      @param geSorting Current sorting.
    */
      getGeneratedColumns(componentName, settingName, modelProjection, geSorting) {
        let projectionAttributes = modelProjection.attributes;
        let fixedColumns = this.get(`defaultDeveloperUserSettings.${componentName}.DEFAULT.columnWidths`) || A();
        fixedColumns = fixedColumns.filter(({ fixed }) => fixed).map(obj => { return obj.propName; });
        let colsOrder = this.get('_userSettingsService').getCurrentColsOrder(componentName, settingName);
        let sorting = geSorting;
        let columns = this._getGeneratedColumns(projectionAttributes, this, fixedColumns, colsOrder, sorting);
        this.set('colDescs', columns);

        this.get('_groupEditEventsService').setDefaultGeSortTrigger(this.get('colDescs'));
        return columns;
      },

    /**
      Show filters dialog.

      @method actions.showFiltersDialog
      @param componentName Component name.
      @param filterColumns columns with available filters.
    */
    showFiltersDialog(componentName, filterColumns, useSidePageMode) {
      let controller = this.get('filtersDialogController');
      controller.set('mainControler', this);

      let loadingParams = {
        view: 'application',
        outlet: 'modal'
      };
      this.send('showModalDialog', 'filters-dialog');

      loadingParams = {
        view: 'filters-dialog',
        outlet: 'modal-content'
      };
      this.send('showModalDialog', 'filters-dialog-content',
        { controller: controller, model: { filterColumns: filterColumns, componentName: componentName, useSidePageMode: useSidePageMode } }, loadingParams);
    },

    /**
      Show adv limit config dialog.

      @method actions.showAdvLimitDialog
      @param componentName Component name.
      @param advLimitName Adv limit name.
    */
    showAdvLimitDialog(componentName, advLimitName) {
      let advLimit = this.get('advLimit').getCurrentAdvLimit(componentName, advLimitName);

      let store = this.get('store');

      let controller = this.get('advLimitController');
      controller.set('mainControler', this);

      let loadingParams = {
        view: 'application',
        outlet: 'modal'
      };
      this.send('showModalDialog', 'advlimit-dialog');

      loadingParams = {
        view: 'advlimit-dialog',
        outlet: 'modal-content'
      };
      this.send('showModalDialog', 'advlimit-dialog-content',
        { controller: controller, model: { advLimit: advLimit, advLimitName: advLimitName, componentName: componentName, store: store } }, loadingParams);
    }
  },

  /**
    Show columns config dialog.

    @method _showConfigDialog
    @param componentName
    @param settingName
    @param settingsSource
    @param isExportExcel
    @param immediateExport
    @private
  */
  _showConfigDialog(componentName, settingName, useSidePageMode, settingsSource, isExportExcel = false, immediateExport = false) {
    let colsOrder = this.get('_userSettingsService').getCurrentColsOrder(componentName, settingName);
    let sorting = this.get('_userSettingsService').getCurrentSorting(componentName, settingName);
    let columnWidths = this.get('_userSettingsService').getCurrentColumnWidths(componentName, settingName);
    let perPageValue = this.get('_userSettingsService').getCurrentPerPage(componentName, settingName);
    let fixedColumns = this.get(`defaultDeveloperUserSettings.${componentName}.DEFAULT.columnWidths`) || A();
    fixedColumns = fixedColumns.filter(({ fixed }) => fixed).map(obj => { return obj.propName; });
    let saveColWidthState = false;
    let propName;
    let colDesc;  //Column description
    let colDescs = A();  //Columns description
    let projectionAttributes;
    let modelName = settingsSource.get('modelProjection.modelName');
    if (isExportExcel) {
      let exportExcelProjectionName = settingsSource.get('exportExcelProjection') || settingsSource.get('modelProjection.projectionName');
      assert('Property exportExcelProjection is not defined in controller.', exportExcelProjectionName);

      let exportExcelProjection = this.store.modelFor(modelName).projections.get(exportExcelProjectionName);
      assert(`Projection "${exportExcelProjectionName}" is not defined in model "${modelName}".`, exportExcelProjection);

      projectionAttributes = exportExcelProjection.attributes;
    } else {
      let modelProjection = settingsSource.get('modelProjection');
      projectionAttributes = modelProjection.attributes;
    }

    let colList = this._generateColumns(projectionAttributes, isExportExcel, null, null, settingsSource);
    let namedColList = {};
    for (let i = 0; i < colList.length; i++) {
      colDesc = colList[i];
      propName = colDesc.propName;
      colDesc.fixed = fixedColumns.indexOf(propName) > -1;
      namedColList[propName] = colDesc;
    }

    if (isArray(colsOrder)) {
      /*
       Remove propName, that are not in colList
       */
      let reliableColsOrder = A();
      for (let i = 0; i < colsOrder.length; i++) {
        let colOrder = colsOrder[i];
        propName = colOrder.propName;
        if ((propName in namedColList) && ('header' in  namedColList[propName])) {
          reliableColsOrder.pushObject(colOrder);
          if (isExportExcel && colOrder.name) {
            set(namedColList[propName], 'header.string', colOrder.name);
          }
        }
      }

      colsOrder = reliableColsOrder;
    } else {
      colsOrder = colList;
    }

    let namedSorting = {};
    let sortPriority = 0;
    if (isNone(sorting)) {
      sorting = A();
    }

    for (let i = 0; i < sorting.length; i++) {
      colDesc = sorting[i];
      propName = colDesc.propName;
      if (propName in namedColList) {
        colDesc.sortPriority = ++sortPriority;
        namedSorting[propName] = colDesc;
      }
    }

    if (isNone(columnWidths)) {
      columnWidths = A();
    }

    let namedColWidth = {};

    if (isNone(settingName)) {
      namedColWidth = settingsSource.get('currentColumnsWidths') || {};
    } else {
      for (let i = 0; i < columnWidths.length; i++) {
        colDesc = columnWidths[i];
        propName = colDesc.propName;
        namedColWidth[propName] = colDesc.width;
      }
    }

    if (columnWidths.length > 0) {
      saveColWidthState = true;
    }

    for (let i = 0; i < colsOrder.length; i++) {
      let colOrder = colsOrder[i];
      propName = colOrder.propName;
      if (!(propName in namedColList) || !('header' in  namedColList[propName])) {
        delete namedColList[propName];
        continue;
      }

      let name = namedColList[propName].header;
      let isHasMany = namedColList[propName].isHasMany;
      let fixed = namedColList[propName].fixed;
      delete namedColList[propName];
      colDesc = { name: name, propName: propName, hide: colOrder.hide, isHasMany: isHasMany, fixed: fixed };
      if (propName in namedSorting) {
        let sortColumn = namedSorting[propName];
        colDesc.sortOrder = sortColumn.direction === 'asc' ? 1 : -1;
        colDesc.sortPriority = sortColumn.sortPriority;
      } else {
        colDesc.sortOrder = 0;
      }

      if (propName in namedColWidth) {
        colDesc.columnWidth = namedColWidth[propName];
      }

      colDescs.pushObject(colDesc);
    }

    for (propName in namedColList) {
      colDescs.pushObject({ propName: propName, name: namedColList[propName].header, hide: false, sortOrder: 0,
        isHasMany: namedColList[propName].isHasMany, fixed: namedColList[propName].fixed });
    }

    let exportParams = { isExportExcel: isExportExcel };
    let settName = settingName;
    if (isExportExcel) {
      let exportExcelProjectionName = settingsSource.get('exportExcelProjection') || settingsSource.get('modelProjection.projectionName');
      exportParams.immediateExport = immediateExport;
      exportParams.projectionName = exportExcelProjectionName;
      exportParams.detSeparateCols = this.get('_userSettingsService').getDetSeparateCols(componentName, settingName);
      exportParams.detSeparateRows = this.get('_userSettingsService').getDetSeparateRows(componentName, settingName);
      if (settName) {
        settName = settName.split('/');
        settName.shift();
        settName = settName.join('/');
      }
    }

    let store = this.get('store');

    let controller = this.get('colsconfigController');
    controller.set('mainControler', this);
    let loadingParams = {
      view: 'application',
      outlet: 'modal'
    };
    this.send('showModalDialog', 'colsconfig-dialog');

    loadingParams = {
      view: 'colsconfig-dialog',
      outlet: 'modal-content'
    };
    this.send('showModalDialog', 'colsconfig-dialog-content',
      { controller: controller, model: { modelName: modelName, colDescs: colDescs, componentName: componentName,
      settingName: settName, perPageValue: perPageValue, saveColWidthState: saveColWidthState,
      exportParams: exportParams, store: store, useSidePageMode: useSidePageMode } }, loadingParams);
  },

    /**
    Get columns info.

    @method _getGeneratedColumns
    @param projectionAttributes
    @param settingsSource
    @param fixedColumns
    @param colsOrder
    @param sorting
    @private
  */
    _getGeneratedColumns(projectionAttributes, settingsSource, fixedColumns, colsOrder, sorting) {
      let colDesc;  //Column description
      let colDescs = A();  //Columns description
      let propName;

      let colList = this._generateColumns(projectionAttributes, false, null, null, settingsSource);
      let namedColList = {};

      for (let i = 0; i < colList.length; i++) {
        colDesc = colList[i];
        propName = colDesc.propName;
        colDesc.fixed = fixedColumns.indexOf(propName) > -1;
        namedColList[propName] = colDesc;
      }

      if (isArray(colsOrder)) {
        /*
        Remove propName, that are not in colList
        */
        let reliableColsOrder = A();
        for (let i = 0; i < colsOrder.length; i++) {
          let colOrder = colsOrder[i];
          propName = colOrder.propName;
          if ((propName in namedColList) && ('header' in  namedColList[propName])) {
            reliableColsOrder.pushObject(colOrder);
          }
        }

        colsOrder = reliableColsOrder;
      } else {
        colsOrder = colList;
      }

      let namedSorting = {};
      let sortPriority = 0;
      if (isNone(sorting)) {
        sorting = A();
      }

      for (let i = 0; i < sorting.length; i++) {
        colDesc = sorting[i];
        propName = colDesc.propName;
        if (propName in namedColList) {
          colDesc.sortPriority = ++sortPriority;
          namedSorting[propName] = colDesc;
        }
      }

      for (let i = 0; i < colsOrder.length; i++) {
        let colOrder = colsOrder[i];
        propName = colOrder.propName;

        if (!(propName in namedColList) || !('header' in  namedColList[propName])) {
          delete namedColList[propName];
          continue;
        }

        let name = namedColList[propName].header;
        let isHasMany = namedColList[propName].isHasMany;
        let fixed = namedColList[propName].fixed;
        delete namedColList[propName];
        colDesc = { name: name, propName: propName, isHasMany: isHasMany, fixed: fixed };

        if (propName in namedSorting) {
          let sortColumn = namedSorting[propName];
          colDesc.sortOrder = sortColumn.direction === 'asc' ? 1 : -1;
          colDesc.sortPriority = sortColumn.sortPriority;
        } else {
          colDesc.sortOrder = 0;
        }

        colDescs.pushObject(colDesc);
      }

      for (propName in namedColList) {
        colDescs.pushObject({ propName: propName, name: namedColList[propName].header, sortOrder: 0,
          isHasMany: namedColList[propName].isHasMany, fixed: namedColList[propName].fixed });
      }

      return colDescs;
    },

    /**
    Show columns config dialog for groupedit.

    @method _showSortGeDialog
    @param componentName
    @param useSidePageMode
    @param modelProjection
    @param geSorting
    @private
  */
    _showSortGeDialog(componentName, useSidePageMode, modelProjection, geSorting) {
    let colsOrder = this.get('_userSettingsService').getCurrentColsOrder(componentName);
    let sorting = geSorting;
    let fixedColumns = this.get(`defaultDeveloperUserSettings.${componentName}.DEFAULT.columnWidths`) || A();
    fixedColumns = fixedColumns.filter(({ fixed }) => fixed).map(obj => { return obj.propName; });
    let modelName = modelProjection.modelName;
    let projectionAttributes = modelProjection.attributes;
    
    let colDescs = this._getGeneratedColumns(projectionAttributes,
      this, fixedColumns, colsOrder, sorting);

    let store = this.get('store');

    let controller = this.get('colsconfigController');
    controller.set('mainControler', this);
    this.send('showModalDialog', 'colsconfig-dialog');

    let loadingParams = {
      view: 'colsconfig-dialog',
      outlet: 'modal-content'
    };

      this.send('showModalDialog', 'ge-sorting-dialog-content',
      { controller: controller, model: { modelName: modelName, colDescs: colDescs, componentName: componentName,
      store: store, useSidePageMode: useSidePageMode, geSorting: geSorting } }, loadingParams);

    },

  /**
    Generate the columns.

    @method _generateColumns
    @private
  */
  _generateColumns(attributes, isExportExcel, columnsBuf, relationshipPath, settingsSource) {
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
        case 'hasMany': {
          if (isExportExcel && !attr.options.hidden) {
            let bindingPath = currentRelationshipPath + attrName;
            let column = this._createColumn(attr, attrName, bindingPath, settingsSource, true);
            columnsBuf.pushObject(column);
          }

          break;
        }

        case 'belongsTo': {
          if (!attr.options.hidden) {
            let bindingPath = currentRelationshipPath + attrName;
            let column = this._createColumn(attr, attrName, bindingPath, settingsSource);

            if (isNone(get(column, 'cellComponent.componentName'))) {
              if (attr.options.displayMemberPath) {
                column.propName += '.' + attr.options.displayMemberPath;
              } else {
                column.propName += '.id';
              }
            }

            columnsBuf.pushObject(column);
          }

          currentRelationshipPath += attrName + '.';
          this._generateColumns(attr.attributes, isExportExcel, columnsBuf, currentRelationshipPath, settingsSource);
          break;
        }

        case 'attr': {
          if (attr.options.hidden) {
            break;
          }

          let bindingPath = currentRelationshipPath + attrName;
          let column = this._createColumn(attr, attrName, bindingPath, settingsSource);
          columnsBuf.pushObject(column);
          break;
        }
      }
    }

    return columnsBuf.sortBy('index');
  },

  /**
    Create the key from locales.
  */
  _createKey(bindingPath, settingsSource) {
    let projection = settingsSource.get('modelProjection');
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
  _createColumn(attr, attrName, bindingPath, settingsSource, isHasMany = false) {
    let currentController = this.get('currentController');
    let getCellComponent = get(currentController || {}, 'getCellComponent');
    let cellComponent = settingsSource.get('cellComponent');

    if (!this.get('editOnSeparateRoute') && typeOf(getCellComponent) === 'function') {
      let recordModel = isNone(this.get('content')) ? null : this.get('content.type');
      cellComponent = getCellComponent.call(currentController, attr, bindingPath, recordModel);
    }

    let key = this._createKey(bindingPath, settingsSource);
    let valueFromLocales = getValueFromLocales(this.get('i18n'), key);
    let index = get(attr, 'options.index');

    let column = {
      header: valueFromLocales || htmlSafe(attr.caption || capitalize(attrName)),
      propName: bindingPath,
      cellComponent: cellComponent,
      isHasMany: isHasMany,
      index: index,
    };

    if (valueFromLocales) {
      column.keyLocale = key;
    }

    let customColumnAttributesFunc = settingsSource.get('customColumnAttributes');
    if (customColumnAttributesFunc) {
      let customColAttr = customColumnAttributesFunc(attr, bindingPath);
      if (customColAttr && (typeof customColAttr === 'object')) {
        $.extend(true, column, customColAttr);
      }
    }

    let sortDef;
    let sorting = settingsSource.get('sorting');
    if (sorting && (sortDef = sorting[bindingPath])) {
      column.sorted = true;
      column.sortAscending = sortDef.sortAscending;
      column.sortNumber = sortDef.sortNumber;
    }

    return column;
  }
});
