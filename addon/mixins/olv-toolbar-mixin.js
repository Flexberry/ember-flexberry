import Ember from 'ember';
import { getValueFromLocales } from 'ember-flexberry-data/utils/model-functions';

// TODO: rename file, add 'controller' word into filename.
export default Ember.Mixin.create({
  _userSettingsService: Ember.inject.service('user-settings'),
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

  actions: {
    showConfigDialog: function(componentName, settingName) {
      let colsOrder = this.get('_userSettingsService').getCurrentColsOrder(componentName, settingName);
      let sorting = this.get('_userSettingsService').getCurrentSorting(componentName, settingName);
      let columnWidths = this.get('userSettingsService').getCurrentColumnWidths(componentName, settingName);
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
        colDesc.sortPriority = ++sortPriority;
        propName = colDesc.propName;
        namedSorting[propName] = colDesc;
      }

      if (columnWidths === undefined) {
        columnWidths = [];
      }

      let namedColWidth = {};
      for (let i = 0; i < columnWidths.length; i++) {
        colDesc = columnWidths[i];
        propName = colDesc.propName;
        namedColWidth[propName] = colDesc.width;
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

        colDescs[i] = colDesc;
      }

      for (propName in namedColList) {
        colDescs[colDescs.length] = { propName: propName, name: namedColList[propName].header, hide: false, sortOrder: 0 };
      }

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
                { controller: controller, model: { colDescs: colDescs, componentName: componentName, settingName: settingName } },
                loadingParams);
    }

  },

  /**
   *    Generate the columns.
   *
   *    @method _generateColumns
   *    @private
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

          //TODO: this is temporarily solution, please refactor this code when cancer at mount will whistle.
          if (true || !attr.options.hidden) {
            let bindingPath = currentRelationshipPath + attrName;
            let column = this._createColumn(attr, attrName, bindingPath);

            if (column.cellComponent && column.cellComponent.componentName === 'object-list-view-cell') {
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

          //TODO: this is temporarily solution, please refactor this code when cancer at mount will whistle.
          if (false && attr.options.hidden) {
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
    let cellComponent = this.get('cellComponent') || {};

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
});
