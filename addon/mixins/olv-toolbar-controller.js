import Ember from 'ember';
import { getValueFromLocales } from 'ember-flexberry-data/utils/model-functions';

export default Ember.Mixin.create({
  _userSettingsService: Ember.inject.service('user-settings'),
  _advLimitService: Ember.inject.service('adv-limit'),
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
    showConfigDialog: function(componentName, settingName, isExportExcel = false, immediateExport = false) {
      this._showConfigDialog(componentName, settingName, this, isExportExcel, immediateExport);
    }
  },

  _showConfigDialog: function(componentName, settingName, settingsSource, isExportExcel = false, immediateExport = false) {
    let colsOrder = this.get('_userSettingsService').getCurrentColsOrder(componentName, settingName);
    let sorting = this.get('_userSettingsService').getCurrentSorting(componentName, settingName);
    let columnWidths = this.get('_userSettingsService').getCurrentColumnWidths(componentName, settingName);
    let perPageValue = this.get('_userSettingsService').getCurrentPerPage(componentName, settingName);
    let fixedColumns = this.get(`defaultDeveloperUserSettings.${componentName}.DEFAULT.columnWidths`) || Ember.A();
    fixedColumns = fixedColumns.filter(({ fixed }) => fixed).map(obj => { return obj.propName; });
    let saveColWidthState = false;
    let propName;
    let colDesc;  //Column description
    let colDescs = Ember.A();  //Columns description
    let projectionAttributes;
    let modelName = settingsSource.get('modelProjection.modelName');
    if (isExportExcel) {
      let exportExcelProjectionName = settingsSource.get('exportExcelProjection') || settingsSource.get('modelProjection.projectionName');
      Ember.assert('Property exportExcelProjection is not defined in controller.', exportExcelProjectionName);

      let exportExcelProjection = this.store.modelFor(modelName).projections.get(exportExcelProjectionName);
      Ember.assert(`Projection "${exportExcelProjectionName}" is not defined in model "${modelName}".`, exportExcelProjection);

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

    if (Ember.isArray(colsOrder)) {
      /*
       Remove propName, that are not in colList
       */
      let reliableColsOrder = Ember.A();
      for (let i = 0; i < colsOrder.length; i++) {
        let colOrder = colsOrder[i];
        propName = colOrder.propName;
        if ((propName in namedColList) && ('header' in  namedColList[propName])) {
          reliableColsOrder.pushObject(colOrder);
          if (isExportExcel && colOrder.name) {
            Ember.set(namedColList[propName], 'header.string', colOrder.name);
          }
        }
      }

      colsOrder = reliableColsOrder;
    } else {
      colsOrder = colList;
    }

    let namedSorting = {};
    let sortPriority = 0;
    if (Ember.isNone(sorting)) {
      sorting = Ember.A();
    }

    for (let i = 0; i < sorting.length; i++) {
      colDesc = sorting[i];
      propName = colDesc.propName;
      if (propName in namedColList) {
        colDesc.sortPriority = ++sortPriority;
        namedSorting[propName] = colDesc;
      }
    }

    if (Ember.isNone(columnWidths)) {
      columnWidths = Ember.A();
    }

    let namedColWidth = {};

    if (Ember.isNone(settingName)) {
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
      exportParams: exportParams, store: store } }, loadingParams);
    },

    showAdvLimitDialog: function(componentName, settingName, isExportExcel = false, immediateExport = false) {
      let colsOrder = this.get('_advLimitService').getCurrentColsOrder(componentName, settingName);
      let sorting = this.get('_userSettingsService').getCurrentSorting(componentName, settingName);
      let columnWidths = this.get('_userSettingsService').getCurrentColumnWidths(componentName, settingName);
      let perPageValue = this.get('_userSettingsService').getCurrentPerPage(componentName, settingName);
      let fixedColumns = this.get('defaultDeveloperUserSettings');
      fixedColumns = fixedColumns ? fixedColumns[componentName] : undefined;
      fixedColumns = fixedColumns ? fixedColumns.DEFAULT : undefined;
      fixedColumns = fixedColumns ? fixedColumns.columnWidths || [] : [];
      fixedColumns = fixedColumns.filter(({ fixed }) => fixed).map(obj => { return obj.propName; });
      let saveColWidthState = false;
      let propName;
      let colDesc;  //Column description
      let colDescs = [];  //Columns description
      let projectionAttributes;
      let modelName = this.get('modelProjection.modelName');
      if (isExportExcel) {
        let exportExcelProjectionName = this.get('exportExcelProjection') || this.get('modelProjection.projectionName');
        Ember.assert('Property exportExcelProjection is not defined in controller.', exportExcelProjectionName);

        let exportExcelProjection = this.store.modelFor(modelName).projections.get(exportExcelProjectionName);
        Ember.assert(`Projection "${exportExcelProjectionName}" is not defined in model "${modelName}".`, exportExcelProjection);

        projectionAttributes = exportExcelProjection.attributes;
      } else {
        projectionAttributes = this.modelProjection.attributes;
      }

      let colList = this._generateColumns(projectionAttributes, isExportExcel);
      let namedColList = {};
      for (let i = 0; i < colList.length; i++) {
        colDesc = colList[i];
        propName = colDesc.propName;
        colDesc.fixed = fixedColumns.indexOf(propName) > -1;
        namedColList[propName] = colDesc;
      }

      if (Ember.isArray(colsOrder)) {

        // Remove propName, that are not in colList

        let reliableColsOrder = [];
        for (let i = 0; i < colsOrder.length; i++) {
          let colOrder = colsOrder[i];
          propName = colOrder.propName;
          if ((propName in namedColList) && ('header' in  namedColList[propName])) {
            reliableColsOrder.push(colOrder);
            if (isExportExcel && colOrder.name) {
              Ember.set(namedColList[propName], 'header.string', colOrder.name);
            }
          }
        }

        colsOrder = reliableColsOrder;
      } else {
        colsOrder = colList;
      }

      let namedSorting = {};
      let sortPriority = 0;
      if (sorting === undefined) {
        sorting = [];
      }

      for (let i = 0; i < sorting.length; i++) {
        colDesc = sorting[i];
        propName = colDesc.propName;
        if (propName in namedColList) {
          colDesc.sortPriority = ++sortPriority;
          namedSorting[propName] = colDesc;
        }
      }

      if (columnWidths === undefined) {
        columnWidths = [];
      }

      let namedColWidth = {};

      if (Ember.isNone(settingName)) {
        namedColWidth = this.get('currentColumnsWidths') || {};
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

        colDescs.push(colDesc);
      }

      for (propName in namedColList) {
        colDescs.push({ propName: propName, name: namedColList[propName].header, hide: false, sortOrder: 0,
          isHasMany: namedColList[propName].isHasMany, fixed: namedColList[propName].fixed });
      }

      let exportParams = { isExportExcel: isExportExcel };
      let settName = settingName;
      if (isExportExcel) {
        exportParams.immediateExport = immediateExport;
        exportParams.projectionName = this.get('exportExcelProjection') || this.get('modelProjection.projectionName');
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
      this.send('showModalDialog', 'advlimit-dialog');

      loadingParams = {
        view: 'advlimit-dialog',
        outlet: 'modal-content'
      };
      this.send('showModalDialog', 'advlimit-dialog-content',
        { controller: controller, model: { modelName: modelName, colDescs: colDescs, componentName: componentName,
        settingName: settName, perPageValue: perPageValue, saveColWidthState: saveColWidthState,
        exportParams: exportParams, store: store } }, loadingParams);
  },

  /**
    Generate the columns.

    @method _generateColumns
    @private
  */
  _generateColumns(attributes, isExportExcel, columnsBuf, relationshipPath, settingsSource) {
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
          if (isExportExcel && !attr.options.hidden) {
            let bindingPath = currentRelationshipPath + attrName;
            let column = this._createColumn(attr, attrName, bindingPath, settingsSource, true);
            columnsBuf.pushObject(column);
          }

          break;

        case 'belongsTo':
          if (!attr.options.hidden) {
            let bindingPath = currentRelationshipPath + attrName;
            let column = this._createColumn(attr, attrName, bindingPath, settingsSource);

            if (Ember.isNone(Ember.get(column, 'cellComponent.componentName'))) {
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

        case 'attr':
          if (attr.options.hidden) {
            break;
          }

          let bindingPath = currentRelationshipPath + attrName;
          let column = this._createColumn(attr, attrName, bindingPath, settingsSource);
          columnsBuf.pushObject(column);
          break;
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
  _createColumn(attr, attrName, bindingPath, settingsSource, isHasMany = false) {
    let currentController = this.get('currentController');
    let getCellComponent = Ember.get(currentController || {}, 'getCellComponent');
    let cellComponent = settingsSource.get('cellComponent');

    if (!this.get('editOnSeparateRoute') && Ember.typeOf(getCellComponent) === 'function') {
      let recordModel = Ember.isNone(this.get('content')) ? null : this.get('content.type');
      cellComponent = getCellComponent.call(currentController, attr, bindingPath, recordModel);
    }

    let key = this._createKey(bindingPath, settingsSource);
    let valueFromLocales = getValueFromLocales(this.get('i18n'), key);
    let index = Ember.get(attr, 'options.index');

    let column = {
      header: valueFromLocales || attr.caption || Ember.String.capitalize(attrName),
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
        Ember.$.extend(true, column, customColAttr);
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
