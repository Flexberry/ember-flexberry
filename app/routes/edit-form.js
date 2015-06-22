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
  },

  actions: {
    showLookupDialog: function(model, lookupPropName) {
      // get ember static function to get relation by name
      var relationshipsByName = Ember.get(model.constructor, 'relationshipsByName');
      // get lookup 'belongsTo' property from model
      var lookupProp = relationshipsByName.get(lookupPropName);
      if (!lookupProp) {
        throw new Error(`No relation with '${lookupPropName}' name defined in '${model.constructor.typeKey}' model.`);
      }
      // get property type name
      var relatedToType = lookupProp.type.typeKey;
      // get projection name from 'belongsTo' options
      var projectionName = lookupProp.options.projection;
      if (!projectionName) {
        throw new Error(`No projection option defined in '${lookupPropName}' relation. ` +
          `You have to define a projection name prop (projection) in '${lookupPropName}' relation, ` +
          `and define a projection with that name in '${relatedToType}' model.`);
      }
      // get property type constructor by type name
      var relatedTypeConstructor = this.store.modelFor(relatedToType);
      // get a projection from related type model
      var projection = Ember.get(relatedTypeConstructor, 'projections')[projectionName];
      if (!projection) {
        throw new Error(`No projection with '${projectionName}' name defined in '${relatedToType}' model. `);
      }
      var self = this;

      this.store.find(relatedToType, {
        __fetchingProjection: projection
      }).then(function (data) {
        var controller = self.controllerFor('lookup-dialog')
          .clear()
          .set('modelProjection', projection)
          .set('saveTo', {
            model: model,
            propName: lookupPropName
          });

        self.send('showModalDialog', 'lookup-dialog', {
          controller: controller,
          model: data
        });
      });
    }
  }
});
