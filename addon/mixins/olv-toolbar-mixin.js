import Ember from 'ember';

// TODO: rename file, add 'controller' word into filename.
export default Ember.Mixin.create({
  actions: {
    showConfigDialog: function() {
//       alert('showConfigDialog');
      let colDesc,model=[];
      let projectionAttributes=this.modelProjection.attributes;
      let sortOrder,sortPriority=0;
      let colList=this._generateColumns(projectionAttributes);

      for (let n=0; n<colList.length; n++) {
        let col=colList[n];
        colDesc={name:col.header,propName:col.propName};
        colDesc.hide=(n%2?false:true);
        sortOrder=(n%3)-1;
        colDesc.sortOrder=sortOrder;
        if (sortOrder!=0) {
          sortPriority+=1;
          colDesc['sortPriority']=sortPriority;
        }
        model[n]=colDesc;
      }
//       alert(JSON.stringify(model));
      let controller = this.get('colsconfigController');

      var loadingParams = {
        view: 'application',
        outlet: 'modal',
      };
      this.send('showModalDialog', "colsconfig-dialog");

      var loadingParams = {
        view: 'colsconfig-dialog',
        outlet: 'modal-content'
      };
      this.send('showModalDialog', "colsconfig-dialog-content",
                {controller: controller,model:model},
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
