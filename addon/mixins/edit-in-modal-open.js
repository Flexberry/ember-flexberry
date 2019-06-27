import Ember from 'ember';

export default Ember.Mixin.create({
  /**
    Service that triggers objectlistview events.
    @property objectlistviewEvents
    @type Service
  */
  objectlistviewEvents: Ember.inject.service(),

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

  actions: {
    /**
      {{#crossLink "FlexberryGroupeditComponent"}}{{/crossLink}} row click handler.
      It sets `modelNoRollBack` to `true` at current controller, redirects to detail's route, save necessary data to service.

      @method actions.groupEditRowClick
      @param {Ember.Object} record Record related to clicked table row.
      @param {Object} [options] Record related to clicked table row.
      @param {Boolean} options.saveBeforeRouteLeave Flag: indicates whether to save current model before going to the detail's route.
      @param {Boolean} options.editOnSeparateRoute Flag: indicates whether to edit detail on separate route.
      @param {String} options.modelName Clicked detail model name (used to create record if record is undefined).
      @param {Array} options.detailArray Current detail array (used to add record to if record is undefined).
      @param {Boolean} options.editFormRoute Path to detail's form.
    */
    groupEditRowClick(record, options) {
      let editOnSeparateRoute = options.editOnSeparateRoute;

      if (editOnSeparateRoute) {
        throw new Error('Option editOnSeparateRoute doesn\'t supported with edit in modal');
      }
    }
  },

  /**
    Open modal window fo edit record or create new record.

    @method _openModalDialog
    @param {Object} modelObject record or model controller, when record is created.
    @param {String} editFormRoute name of edit record route for modal content.
    @param {Boolean} isNewRecord flag indicates when modal record open fo create new record.
    @private
  */
  _openModalDialog(modelObject, editFormRoute, isNewRecord) {
    let controllerForShowModalAction = isNewRecord ? modelObject : this;

    // getting parameters for main modal window
    let modalControllerName = this.get('_modalControllerName');
    let modalController = Ember.getOwner(this).lookup('controller:' + modalControllerName);
    let modalControllerOutlet = modalController.get('modalOutletName');
    let modalTemplateName = this.get('_modalTemplateName');

    let loadingParams = {
      outlet: modalControllerOutlet,
    };

    //show main modal window
    controllerForShowModalAction.send('showModalDialog', modalTemplateName, null, loadingParams);

    // getting parameters for content modal window
    let modalContentControllerName = editFormRoute;
    let modalContentController = Ember.getOwner(this).lookup('controller:' + modalContentControllerName);
    let modalContentControllerOutlet = modalController.get('modalContentOutletName');
    let modalContentTemplate = editFormRoute;

    loadingParams = {
      view: modalTemplateName,
      outlet: modalContentControllerOutlet
    };

    //setting data for modal content
    let modelName = (isNewRecord) ? modelObject.get('modelProjection.modelName') : modelObject.constructor.modelName;
    let record = (isNewRecord) ? modelObject.store.createRecord(modelName) : modelObject;

    //get projection from record
    let modelProjName = Ember.getOwner(this).lookup('route:' + editFormRoute).get('modelProjection');

    let proj = record.get(`constructor.projections.${modelProjName}`);

    //set parameters in modal content controller
    modalContentController.set('modelProjection', proj);
    modalContentController.set('isModal', true);
    modalContentController.set('modalController', modalController);
    this.get('objectlistviewEvents').one('editRecordDialogHidden', modalContentController, modalContentController.rollbackAll);

    //show content modal window
    if (isNewRecord) {
      controllerForShowModalAction.send('showModalDialog', modalContentTemplate,
        { controller: modalContentController, model: record }, loadingParams);
    } else {
      let recordId = record.get('id') || record.get('data.id');
      this.store.findRecord(modelName, recordId, { projection: modelProjName }).then((findingRecord) => {
        controllerForShowModalAction.send('showModalDialog', modalContentTemplate,
        { controller: modalContentController, model: findingRecord }, loadingParams);
      });
    }
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
