import Mixin from '@ember/object/mixin';
import { getOwner } from '@ember/application';
import { inject as service} from '@ember/service';
import { get, set } from '@ember/object';

export default Mixin.create({
  /**
    Service that triggers objectlistview events.
    @property objectlistviewEvents
    @type Service
  */
  objectlistviewEvents: service(),

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
    @param {Boolean} useSidePageMode Indicates when use side page mode.
    @private
  */
  _openModalDialog(modelObject, editFormRoute, isNewRecord, useSidePageMode) {
    let controllerForShowModalAction = isNewRecord ? modelObject : this;

    // getting parameters for main modal window
    let modalControllerName = this.get('_modalControllerName');
    let modalController = getOwner(this).lookup('controller:' + modalControllerName);
    let modalControllerOutlet = get(modalController, 'modalOutletName');
    let modalTemplateName = this.get('_modalTemplateName');

    let loadingParams = {
      outlet: modalControllerOutlet,
    };

    //show main modal window
    controllerForShowModalAction.send('showModalDialog', modalTemplateName, null, loadingParams);

    // getting parameters for content modal window
    let modalContentControllerName = editFormRoute;
    let modalContentController = getOwner(this).lookup('controller:' + modalContentControllerName);
    let modalContentControllerOutlet = get(modalController, 'modalContentOutletName');
    let modalContentTemplate = editFormRoute;

    loadingParams = {
      view: modalTemplateName,
      outlet: modalContentControllerOutlet
    };

    //setting data for modal content
    let modelName = (isNewRecord) ? get(modelObject, 'modelProjection.modelName') : modelObject.constructor.modelName;
    let record = (isNewRecord) ? modelObject.store.createRecord(modelName) : modelObject;

    //get projection from record
    let modelProjName = get(getOwner(this).lookup('route:' + editFormRoute), 'modelProjection');

    let proj = get(record, `constructor.projections.${modelProjName}`);

    //set parameters in modal content controller
    set(modalController, 'useSidePageMode', useSidePageMode);
    set(modalContentController, 'modelProjection', proj);
    set(modalContentController, 'isModal', true);
    set(modalContentController, 'modalController', modalController);

    this.get('objectlistviewEvents').one('editRecordDialogHidden', modalContentController, modalContentController.rollbackAll);

    //show content modal window
    if (isNewRecord) {
      controllerForShowModalAction.send('showModalDialog', modalContentTemplate,
        { controller: modalContentController, model: record }, loadingParams);
    } else {
      let recordId = get(record, 'id') || get(record, 'data.id');
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
    @param {Boolean} useSidePageMode Indicates when use side page mode.
  */
  openEditModalDialog(record, editFormRoute, useSidePageMode) {
    let openModalForCreateNew = false;
    this._openModalDialog(record, editFormRoute, openModalForCreateNew, useSidePageMode);
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
