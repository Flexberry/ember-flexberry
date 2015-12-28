import Ember from 'ember';
import ProjectedModelFormRoute from '../routes/projected-model-form';

export default ProjectedModelFormRoute.extend({
  /**
   * Service that triggers groupedit events.
   *
   * @property groupEditEventsService
   * @type Service
   */
  groupEditEventsService: Ember.inject.service('groupedit-events'),

  activate() {
    this._super(...arguments);
    this.get('groupEditEventsService').on('groupEditRowAdded', this, this._rowAdded);
    this.get('groupEditEventsService').on('groupEditRowDeleted', this, this._rowDeleted);
  },

  deactivate() {
    this._super(...arguments);
    this.get('groupEditEventsService').off('groupEditRowAdded', this, this._rowAdded);
    this.get('groupEditEventsService').off('groupEditRowDeleted', this, this._rowDeleted);
  },

  model: function(params, transition) {
    this._super.apply(this, arguments);

    let modelName = this.get('modelName');
    let modelProjName = this.get('modelProjection');

    // :id param defined in router.js
    return this.store.findRecord(modelName, params.id, {
      reload: true,
      projection: modelProjName
    });
  },

  resetController: function(controller, isExisting, transition) {
    this._super.apply(this, arguments);

    controller.send('dismissErrorMessages');
    var model = controller.get('model');
    if (model && model.get('isDirty')) {
      model.rollback();
    }
  },

  setupController: function(controller, model) {
    // Call _super for default behavior.
    this._super(controller, model);

    // Define 'modelProjection' for controller instance.
    let modelClass = model.constructor;
    let modelProjName = this.get('modelProjection');
    let proj = modelClass.projections.get(modelProjName);
    controller.set('modelProjection', proj);
  },

  /**
   * Event handler for "row has been selected" event in groupedit.
   *
   * @method _rowAdded
   * @private
   *
   * @param {String} componentName The name of flexberry-groupedit component.
   * @param {Model} record The model corresponding to added row in groupedit.
   */
  _rowAdded: function(componentName, record) {
    // Manually set isDirty flag, because its not working now when change relation props.
    this.controller.get('model').send('becomeDirty');
  },

  /**
   * Event handler for "row has been deleted" event in groupedit.
   *
   * @method __rowDeleted
   * @private
   *
   * @param {String} componentName The name of flexberry-groupedit component.
   * @param {Model} record The model corresponding to deleted row in groupedit.
   */
  _rowDeleted: function(componentName, record) {
    // Manually set isDirty flag, because its not working now when change relation props.
    this.controller.get('model').send('becomeDirty');
  }
});
