import Ember from 'ember';

export default Ember.Mixin.create({
  /**
    Name of using modal controller

    @property _modalControllerName
    @type String
    @default 'editrecord-dialog'
    @private
  */
  _modalControllerName: 'editrecord-dialog',
  

  /**
    Name of using modal template

    @property _modalTemplateName
    @type String
    @default 'editrecord-dialog'
    @private
  */
  _modalTemplateName: 'editrecord-dialog',

  /**
    Open modal window fo edit record or create new record.

    @method _openModalDialog
    @param {Object} dataObject record or model controller.
    @param {String} editFormRoute name of edit record route for modal content.
    @param {Boolean} isNewRecord flag indicates when modal record open fo create new record.
    @private
  */
  _openModalDialog(dataObject, editFormRoute, isNewRecord) {
    let controllerForShowModalAction = (isNewRecord) ? dataObject : this;
    let modalControllerName = this.get('_modalControllerName');
    let modalController = Ember.getOwner(this).lookup('controller:' + modalControllerName);
    let modalControllerOutlet = modalController.get('modalOutletName');

    let loadingParams = {
      outlet: modalControllerOutlet,
    };

    let modalTemplateName = this.get('_modalTemplateName');
    controllerForShowModalAction.send('showModalDialog', modalTemplateName, null, loadingParams);
    
    let modalControllerContentOutlet = modalController.get('modalContentOutletName');

    loadingParams = {
      view: modalTemplateName,
      outlet: modalControllerContentOutlet
    };

    let modalContentController = Ember.getOwner(this).lookup('controller:' + editFormRoute);
    let record = (isNewRecord) ? dataObject.store.createRecord('ember-flexberry-dummy-suggestion-type') : dataObject;

    //get projection from record
    let modelClass = record.constructor;
    let modelProjName = Ember.getOwner(this).lookup('route:' + editFormRoute).get('modelProjection');
    let proj = modelClass.projections.get(modelProjName);

    //set parameters in modal content controller
    modalContentController.set('modelProjection', proj);
    modalContentController.set('isModal', true);
    modalContentController.set('modalController', modalController);

    controllerForShowModalAction.send('showModalDialog', editFormRoute,
      { controller: modalContentController, model: record }, loadingParams);
  },

  /**
    Open edit record in modal window.

    @method openEditModalDialog
    @param {Object} record Record.
    @param {String} editFormRoute name of edit record route for modal content.
  */
  openEditModalDialog(record, editFormRoute) {
    let openModalForCreateNew = false;
    this._openModalDialog(record, editFormRoute, openModalForCreateNew);
  },

  /**
    Open create record in modal window.

    @method openCreateModalDialog
    @param {Object} modelController parent model controller.
    @param {String} editFormRoute name of edit record route for modal content.
  */
  openCreateModalDialog(modelController, editFormRoute) {
    let openModalForCreateNew = true;
    this._openModalDialog(modelController, editFormRoute, openModalForCreateNew);
  }  
});
