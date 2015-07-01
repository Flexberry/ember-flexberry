import Ember from 'ember';

export default Ember.Mixin.create({
  // Lookup controller name.
  lookupControllerName: undefined,

  // Lookup modal dialog name.
  lookupDialogName: undefined,

  actions: {
    showLookupDialog: function(relationName, projectionName) {
      var lookupControllerName = this.get('lookupControllerName');
      if (!lookupControllerName) {
        throw new Error('Lookup controller name is undefined.');
      }

      var lookupDialogName = this.get('lookupDialogName');
      if (!lookupDialogName) {
        throw new Error('Lookup modal dialog name is undefined.');
      }

      if (!projectionName) {
        throw new Error('ProjectionName is undefined.');
      }

      let model = this.get('model');

      // Get ember static function to get relation by name.
      var relationshipsByName = Ember.get(model.constructor, 'relationshipsByName');

      // Get relation property from model.
      var relation = relationshipsByName.get(relationName);
      if (!relation) {
        throw new Error(`No relation with '${relationName}' name defined in '${model.constructor.typeKey}' model.`);
      }

      // Get property type name.
      var relatedToType = relation.type.typeKey;

      // Get property type constructor by type name.
      var relatedTypeConstructor = this.store.modelFor(relatedToType);

      // Get a projection from related type model.
      var projection = Ember.get(relatedTypeConstructor, 'projections')[projectionName];
      if (!projection) {
        throw new Error(`No projection with '${projectionName}' name defined in '${relatedToType}' model. `);
      }

      var controller = this.controllerFor(lookupControllerName)
        .clear()
        .set('modelProjection', projection)
        .set('saveTo', {
          model: model,
          propName: relationName
        });

      this.send('showModalDialog', lookupDialogName, {
        controller: controller,
        model: this.store.find(relatedToType, {
          __fetchingProjection: projection
        })
      });
    },

    removeLookupValue: function(relationName) {
      let model = this.get('model');
      model.set(relationName, undefined);

      // manually set isDirty flag, because its not working now when change relation props
      // no check for 'old' and 'new' lookup data equality, because ember will do it automatically after bug fix
      model.send('becomeDirty');
    }
  }
});
