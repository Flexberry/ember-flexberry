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

  /**
   * Controller to show lookup modal window.
   *
   * @property lookupController
   * @type Ember.InjectedProperty
   * @default undefined
   */
  lookupController: undefined,

  actions: {
    /**
     * Handles action from lookup choose action.
     *
     * @method showLookupDialog
     * @param {Object} chooseData Lookup parameters (projection name, relation name, etc).
     */
    showLookupDialog: function(chooseData) {
      let options = Ember.$.extend(true, {
        projection: undefined,
        relationName: undefined,
        title: undefined,
        limitFunction: undefined,
        modelToLookup: undefined
      }, chooseData);
      let projectionName = options.projection;
      let relationName = options.relationName;
      let title = options.title;
      let limitFunction = options.limitFunction;
      let modelToLookup = options.modelToLookup;

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

      let query = {};
      if (limitFunction && typeof(limitFunction) === 'string' && limitFunction.length > 0) {
        Ember.merge(query, { $filter: limitFunction });
      }

      Ember.merge(query, { projection: projectionName });
      this.store.query(relatedToType, query).then(data => {
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

    /**
     * Handles correcponding route's willTransition action.
     * It sends message about transition to showing lookup modal window controller.
     *
     * @method routeWillTransition
     */
    routeWillTransition: function() {
      this.get('lookupController').send('routeWillTransition');
    },

    removeLookupValue: function(relationName, modelToLookup) {
      let model = modelToLookup ? modelToLookup : this.get('model');
      model.set(relationName, undefined);

      // manually set isDirty flag, because its not working now when change relation props
      // no check for 'old' and 'new' lookup data equality, because ember will do it automatically after bug fix
      model.send('becomeDirty');
    }
  }
});
