import Ember from 'ember';

// TODO: rename file, add 'controller' word into filename.
export default Ember.Mixin.create({
  actions: {
    showConfigDialog: function() {
//       alert('showConfigDialog');
      var colsConfigSettings={
        controllerName: "lookup-dialog", template: "lookup-dialog", contentTemplate: "colsconfig-dialog-content",
      };
      let orderList=['ordernot','orderasc','orderdesc'];
      let record,model=[];
      let projectionAttributes=this.modelProjection.attributes;
      let order,priority=0,n=0;
      for (let prop in projectionAttributes) {
        let colName=projectionAttributes[prop].caption;
        if (projectionAttributes[prop].kind=='belongsTo') {
          colName=colName  + '@' + projectionAttributes[prop].modelName;
        }
        order=(n%3);
        record={name:colName};
        record[orderList[order]]=true;
        if (order!=0) {
          priority+=1;
          record['priority']=priority;
        }
        model[n]=record;
        n+=1;
      }
//       alert(JSON.stringify(model));
      let controller = this.get('colsconfigController');
      var loadingParams = {
        view: 'application',
        outlet: 'modal'
      };
      this.send('showModalDialog', "colsconfig-dialog-content",
                {controller: controller,model:model},
                loadingParams);
    }
  }
});
