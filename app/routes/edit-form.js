import Ember from 'ember';
import IdProxy from '../utils/idproxy';
import AuthenticatedRouteMixin from 'simple-auth/mixins/authenticated-route-mixin';

// TODO: rename to ProjectedModelRoute or something else.
// TODO: routes/list-form-page contains modelProjection and modelTypeKey too. Move them to base class "DataObjectRoute" or something else (projected-model-route maybe).
export default Ember.Route.extend(AuthenticatedRouteMixin, {
  modelProjection: undefined,

  // TODO: really needed? maybe it is possible to get type from current route?
  modelTypeKey: undefined,

  model: function(params, transition) {
    this._super.apply(this, arguments);

    // :id param defined in router.js
    var id = IdProxy.mutate(params.id, this.modelProjection);

    // TODO: optionally: fetch or find.
    return this.store.fetchById(this.modelTypeKey, id);
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
