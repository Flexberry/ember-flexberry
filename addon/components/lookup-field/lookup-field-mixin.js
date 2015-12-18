import Ember from 'ember';

export default Ember.Mixin.create({

  // Lookup settings.
  lookupSettings: {
    controllerName: undefined,
    template: undefined,
    contentTemplate: undefined,
    loaderTemplate: undefined,
    modalWindowWidth: undefined,
    modalWindowHeight:undefined
  },

  actions: {
    showLookupDialog: function(relationName, projectionName, title, modelToLookup) {
      if (!projectionName) {
        throw new Error('ProjectionName is undefined.');
      }

      let model = modelToLookup ? modelToLookup : this.get('model');

      // Get ember static function to get relation by name.
      var relationshipsByName = Ember.get(model.constructor, 'relationshipsByName');

      // Get relation property from model.
      var relation = relationshipsByName.get(relationName);
      if (!relation) {
        throw new Error(`No relation with '${relationName}' name defined in '${model.constructor.modelName}' model.`);
      }

      // Get property type name.
      var relatedToType = relation.type;

      // Get property type constructor by type name.
      var relatedTypeConstructor = this.store.modelFor(relatedToType);

      // Get a projection from related type model.
      var projection = Ember.get(relatedTypeConstructor, 'projections')[projectionName];
      if (!projection) {
        throw new Error(`No projection with '${projectionName}' name defined in '${relatedToType}' model. `);
      }

      // Lookup
      var lookupSettings = this.get('lookupSettings');
      if (!lookupSettings) {
        throw new Error('Lookup settings are undefined.');
      }

      if (!lookupSettings.template) {
        throw new Error('Lookup template is undefined.');
      }

      if (!lookupSettings.controllerName) {
        throw new Error('Lookup controller name is undefined.');
      }

      if (!lookupSettings.contentTemplate) {
        throw new Error('Lookup content template is undefined.');
      }

      if (!lookupSettings.loaderTemplate) {
        throw new Error('Lookup loader template is undefined.');
      }

      if (!lookupSettings.modalWindowWidth) {
        throw new Error('Lookup modal window width is undefined.');
      }

      if (!lookupSettings.modalWindowHeight) {
        throw new Error('Lookup modal window height is undefined.');
      }

      this.send('showModalDialog', lookupSettings.template);
      var loadingParams = {
        view: lookupSettings.template,
        outlet: 'modal-content'
      };
      this.send('showModalDialog', lookupSettings.loaderTemplate, null, loadingParams);

      this.store.query(relatedToType, {
        projection: projectionName
      }).then(data => {
        this.send('removeModalDialog', loadingParams);
        var controller = this.controllerFor(lookupSettings.controllerName)
          .clear()
          .set('modelProjection', projection)
          .set('title', title)
          .set('modalWindowHeight', lookupSettings.modalWindowHeight)
          .set('modalWindowWidth', lookupSettings.modalWindowWidth)
          .set('saveTo', {
            model: model,
            propName: relationName
          })
          .setCurrentRow();

        this.send('showModalDialog', lookupSettings.contentTemplate, {
          controller: controller,
          model: data
        }, loadingParams);
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
