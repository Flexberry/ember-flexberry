import Ember from 'ember';
import { getValueFromLocales } from 'ember-flexberry-data/utils/model-functions';

export default Ember.Mixin.create({
  _userSettingsService: Ember.inject.service('user-settings'),
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
    showConfigDialog: function(componentName, settingName, isExportExcel = false) {
      let colsOrder = this.get('_userSettingsService').getCurrentColsOrder(componentName, settingName);
      let sorting = this.get('_userSettingsService').getCurrentSorting(componentName, settingName);
      let columnWidths = this.get('_userSettingsService').getCurrentColumnWidths(componentName, settingName);
      let perPageValue = this.get('_userSettingsService').getCurrentPerPage(componentName, settingName);
      let saveColWidthState = false;
      let propName;
      let colDesc;  //Column description
      let colDescs = [];  //Columns description
      let projectionAttributes = this.modelProjection.attributes;
      let colList = this._generateColumns(projectionAttributes);
      let namedColList = {};
      for (let i = 0; i < colList.length; i++) {
        colDesc = colList[i];
        propName = colDesc.propName;
        namedColList[propName] = colDesc;
      }

      if (Ember.isArray(colsOrder)) {
        /*
         Remove propName, that are not in colList
         */
        let reliableColsOrder = [];
        for (let i = 0; i < colsOrder.length; i++) {
          let colOrder = colsOrder[i];
          propName = colOrder.propName;
          if ((propName in namedColList) && ('header' in  namedColList[propName])) {
            reliableColsOrder.push(colOrder);
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
        delete namedColList[propName];
        colDesc = { name: name, propName: propName, hide: colOrder.hide };
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
        colDescs.push({ propName: propName, name: namedColList[propName].header, hide: false, sortOrder: 0 });
      }

      let exportParams = {};
      if (isExportExcel) {
        exportParams.queryParams = this.get('queryParams');
        exportParams.isExportExcel = true;
      }

      let store = this.get('store');

      let controller = this.get('colsconfigController');

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
                { controller: controller, model: { colDescs: colDescs, componentName: componentName, settingName: settingName, perPageValue: perPageValue,
                saveColWidthState: saveColWidthState, exportParams: exportParams, store: store } }, loadingParams);
    }

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

    let sortDef;
    let sorting = this.get('sorting');
    if (sorting && (sortDef = sorting[bindingPath])) {
      column.sorted = true;
      column.sortAscending = sortDef.sortAscending;
      column.sortNumber = sortDef.sortNumber;
    }

    return column;
  }
});
