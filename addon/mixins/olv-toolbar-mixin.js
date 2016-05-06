import Ember from 'ember';

// TODO: rename file, add 'controller' word into filename.
export default Ember.Mixin.create({
  actions: {
    showConfigDialog: function() {
//       alert('showConfigDialog');
      let orderList=['ordernot','orderasc','orderdesc'];
      let colDesc,model=[];
      let projectionAttributes=this.modelProjection.attributes;
      let order,priority=0,n=0;

      for (let prop in projectionAttributes) {
        let colName=projectionAttributes[prop].caption;
        if (projectionAttributes[prop].kind=='belongsTo') {
          colName=colName  + '@' + projectionAttributes[prop].modelName;
        }
        colDesc={name:colName};
        colDesc.hide=(n%2?false:true);
        order=(n%3)-1;
        colDesc.sortOrder=order;
//         switch (order) {
//           case 0:
//             colDesc.orderasc='selected';
//             break;
//           case 1:
//             colDesc.ordernot='selected';
//             break;
//           case 2:
//             colDesc.orderdesc='selected';
//             break;
//         }
//         colDesc[orderList[order]]=true;
        if (order!=0) {
          priority+=1;
          colDesc['priority']=priority;
        }
        model[n]=colDesc;
        n+=1;
      }
      alert(JSON.stringify(model));
      let controller = this.get('colsconfigController');

      var loadingParams = {
        view: 'application',
        outlet: 'modal'
      };
      this.send('showModalDialog', "colsconfig-dialog");

      var loadingParams = {
        view: 'colsconfig-dialog',
        outlet: 'modal-content'
      };
//       this.send('showModalDialog', "colsconfig-dialog-content", null, loadingParams);
//       this.send('removeModalDialog', loadingParams);
      this.send('showModalDialog', "colsconfig-dialog-content",
                {controller: controller,model:model},
                loadingParams);
    }
  }
});
