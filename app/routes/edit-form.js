import ProjectedModelRoute from '../routes/base/projected-model-route';

export default ProjectedModelRoute.extend({
  model: function(params, transition) {
    this._super.apply(this, arguments);

    let modelName = this.get('modelName');
    let modelProj = this.get('modelProjection');

    // :id param defined in router.js
    return this.store.findRecord(modelName, params.id, {
      reload: true,
      projection: modelProj
    });
  },

  resetController: function(controller, isExisting, transition) {
    this._super.apply(this, arguments);

    controller.send('dismissErrorMessages');
    var model = controller.get('model');
    if (model && model.get('isDirty')) {
      model.rollback();
    }
  }
});
