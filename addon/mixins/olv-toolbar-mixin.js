import Ember from 'ember';

// TODO: rename file, add 'controller' word into filename.
export default Ember.Mixin.create({
  actions: {
    showConfigDialog: function() {
//       alert('showConfigDialog');
      var colsConfigSettings={
        controllerName: "lookup-dialog", template: "lookup-dialog", contentTemplate: "colsconfig-dialog-content",
      };
      let projectionAttributes=this.modelProjection.attributes;
      let controller = this.get('colsconfigController');
      var loadingParams = {
        view: 'application',
        outlet: 'modal'
      };
//       this.send('showModalDialog', "lookup-dialog",{controller: controller},loadingParams);
//       loadingParams.outlet='modal-content';
      this.send('showModalDialog', "colsconfig-dialog-content",
                {controller: controller,model:{}},
                loadingParams);
    }
  }
});
