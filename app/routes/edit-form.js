import IdProxy from '../utils/idproxy';
import ProjectedModelRoute from '../routes/base/projected-model-route';

export default ProjectedModelRoute.extend({
  model: function(params, transition) {
    this._super.apply(this, arguments);

    // :id param defined in router.js
    var id = IdProxy.mutate(params.id, this.get('modelProjection'));

    // TODO: optionally: fetch or find.
    return this.store.findRecord(this.get('modelName'), id, { reload: true });
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
