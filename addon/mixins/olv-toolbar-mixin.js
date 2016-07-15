import Ember from 'ember';

// TODO: rename file, add 'controller' word into filename.
export default Ember.Mixin.create({
  _userSettingsService: Ember.inject.service('user-settings'),

  actions: {
    showConfigDialog: function(componentName, settingName) {
//       if (!this.get('_userSettingsService').isUserSettingsServiceEnabled) {
//         alert('Реконфигурация отображения столбцов невозможна. Сервис пользовательских настроек выключен.');
//         return;
//       }
//       let listUserSettings = this.model.listUserSettings;
//       let userSettings = settingName !== undefined && settingName in listUserSettings ? listUserSettings[settingName] :  this.model.userSettings;
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

      if (colsOrder === undefined) {
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

            let column = {
              header: attr.caption,
              propName: bindingPath
            };
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
          let column = {
            header: attr.caption,
            propName: bindingPath
          };
          columnsBuf.push(column);
          break;

        default:
          throw new Error(`Unknown kind of projection attribute: ${attr.kind}`);
      }
    }

    return columnsBuf;
  }
});
