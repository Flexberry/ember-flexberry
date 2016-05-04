import Ember from 'ember';

// TODO: rename file, add 'controller' word into filename.
export default Ember.Mixin.create({
  actions: {
    showConfigDialog: function() {
      alert('showConfigDialog');
      var colsConfigSettings={
        controllerName: "colsconfig-dialog", template: "colsconfig-dialog", contentTemplate: "colsconfig-dialog-content",
      };
      var loadingParams = {
        view: colsConfigSettings.template,
        outlet: 'modal-content'
      };
      this.send('showModalDialog', "colsconfig-dialog", null, loadingParams);
    }
  }
});
