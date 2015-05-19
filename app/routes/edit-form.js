//import Ember from 'ember';
import FetchModelRoute from 'prototype-ember-cli-application/routes/fetch-model';
import IdProxy from '../utils/idproxy';

// TODO: rename to ProjectedModelRoute or something else.
// TODO: routes/list-form-page contains view and modelTypeKey too. Move them to base class "DataObjectRoute" or something else.
export default FetchModelRoute.extend({
  // TODO: rename to modelProjection (or modelProjectionName maybe?).
  view: undefined,

  // TODO: really needed? maybe it is possible to get type from current route?
  modelTypeKey: undefined,

  model: function(params, transition) {
    this._super.apply(this, arguments);

    // :id param defined in router.js
    var id = IdProxy.mutate(params.id, this.view);

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
