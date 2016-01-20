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
    this.get('groupEditEventsService').on('groupEditRowsChanged', this, this._rowChanged);
  },

  deactivate() {
    this._super(...arguments);
    this.get('groupEditEventsService').off('groupEditRowAdded', this, this._rowAdded);
    this.get('groupEditEventsService').off('groupEditRowDeleted', this, this._rowDeleted);
    this.get('groupEditEventsService').off('groupEditRowsChanged', this, this._rowChanged);
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
    if (model && model.get('hasDirtyAttributes')) {
      model.rollbackAttributes();
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
    controller.set('modelProjectionName', modelProjName);
  },

  actions: {
    /**
     * Handles willTransition action (this action is fired at the beginning of any attempted transition).
     * It sends message about transition to corresponding controller.
     *
     * @method willTransition
     */
    willTransition: function(transition) {
      this._super(transition);
      this.controller.send('routeWillTransition');
    }
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
    // Manually make record dirty, because ember-data does not do it when relationship changes.
    this.controller.get('model').makeDirty();
  },

  /**
   * Event handler for "row has been deleted" event in groupedit.
   *
   * @method _rowDeleted
   * @private
   *
   * @param {String} componentName The name of flexberry-groupedit component.
   * @param {Model} record The model corresponding to deleted row in groupedit.
   */
  _rowDeleted: function(componentName, record) {
    // Manually make record dirty, because ember-data does not do it when relationship changes.
    this.controller.get('model').makeDirty();
  },

  /**
   * Event handler for "model(s) corresponding to some row(s) was changed" event in groupedit.
   *
   * @method _rowChanged
   * @private
   *
   * @param {String} componentName The name of flexberry-groupedit component.
   */
  _rowChanged: function(componentName) {
    // Manually make record dirty, because ember-data does not do it when relationship changes.
    this.controller.get('model').makeDirty();
  }
});
