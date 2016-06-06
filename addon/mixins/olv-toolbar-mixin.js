import Ember from 'ember';

// TODO: rename file, add 'controller' word into filename.
export default Ember.Mixin.create({
  _userSettingsService: Ember.inject.service('user-settings-service'),

  actions: {
    showConfigDialog: function() {
      if (!this.get('_userSettingsService').isUserSettingsServiceEnabled) {
        alert('Реконфигурация отображения столбцов невозможна. Сервис пользовательских настроек выключен.');
        return;
      }

      let userSettings = this.model.userSettings;
      let propName;
      let colDesc;
      let model = [];
      let projectionAttributes = this.modelProjection.attributes;
      let colList = this._generateColumns(projectionAttributes);
      let namedColList = {};
      for (let i = 0; i < colList.length; i++) {
        colDesc = colList[i];
        propName = colDesc.propName;
        namedColList[propName] = colDesc;
      }

      if (userSettings && userSettings.colsOrder !== undefined) {
        let namedSorting = {};
        let sortPriority = 0;
        if (userSettings.sorting === undefined) {
          userSettings.sorting = [];
        }

        for (let i = 0; i < userSettings.sorting.length; i++) {
          colDesc = userSettings.sorting[i];
          colDesc.sortPriority = ++sortPriority;
          propName = colDesc.propName;
          namedSorting[propName] = colDesc;
        }

        for (let i = 0; i < userSettings.colsOrder.length; i++) {
          let colOrder = userSettings.colsOrder[i];
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

          model[i] = colDesc;
        }

      }

      for (propName in namedColList) {
        model[model.length] = { propName: propName, name: namedColList[propName].header, hide: false, sortOrder: 0 };
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
                { controller: controller, model: model },
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
