/**
 * @module ember-flexberry
 */

import Ember from 'ember';

import QueryBuilder from 'ember-flexberry-data/query/builder';

// TODO: rename file, add 'controller' word into filename.
export default Ember.Mixin.create({
  // Lookup settings.
  lookupSettings: {
    controllerName: undefined,
    template: undefined,
    contentTemplate: undefined,
    loaderTemplate: undefined
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
        predicate: undefined,
        modelToLookup: undefined,
        sizeClass: undefined
      }, chooseData);

      let projectionName = options.projection;
      let relationName = options.relationName;
      let title = options.title;
      let modelToLookup = options.modelToLookup;
      let sizeClass = options.sizeClass;

      if (!projectionName) {
        throw new Error('ProjectionName is undefined.');
      }

      let model = modelToLookup ? modelToLookup : this.get('model');

      // Get ember static function to get relation by name.
      let relationshipsByName = Ember.get(model.constructor, 'relationshipsByName');

      // Get relation property from model.
      let relation = relationshipsByName.get(relationName);
      if (!relation) {
        throw new Error(`No relation with '${relationName}' name defined in '${model.constructor.modelName}' model.`);
      }

      // Get property type name.
      let relatedToType = relation.type;

      // Get property type constructor by type name.
      let relatedTypeConstructor = this.store.modelFor(relatedToType);

      // Get a projection from related type model.
      let projection = Ember.get(relatedTypeConstructor, 'projections')[projectionName];
      if (!projection) {
        throw new Error(`No projection with '${projectionName}' name defined in '${relatedToType}' model. `);
      }

      // Lookup
      let lookupSettings = this.get('lookupSettings');
      if (!lookupSettings) {
        throw new Error('Lookup settings are undefined.');
      }

      // TODO: maybe default params or Ember.assert\warn?
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

      let controller = this.get('lookupController');
      controller.clear();
      controller.setProperties({
        modelProjection: projection,
        title: title,
        sizeClass: sizeClass,
        saveTo: {
          model: model,
          propName: relationName
        }
      });

      this.send('showModalDialog', lookupSettings.template);
      let loadingParams = {
        view: lookupSettings.template,
        outlet: 'modal-content'
      };
      this.send('showModalDialog', lookupSettings.loaderTemplate, null, loadingParams);

      let builder = new QueryBuilder(this.store)
        .from(relatedToType)
        .selectByProjection(projectionName);

      if (options.predicate) {
        builder.where(options.predicate);
      }

      this.store.query(relatedToType, builder.build()).then(data => {
        this.send('removeModalDialog', loadingParams);
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

    /**
     * Handles action from lookup remove action.
     *
     * @method removeLookupValue
     * @param {Object} removeData Lookup parameters (projection name, etc).
     */
    removeLookupValue: function(removeData) {
      let options = Ember.$.extend(true, {
        relationName: undefined,
        modelToLookup: undefined
      }, removeData);
      let relationName = options.relationName;
      let modelToLookup = options.modelToLookup;

      let model = modelToLookup ? modelToLookup : this.get('model');
      model.set(relationName, undefined);

      // Manually make record dirty, because ember-data does not do it when relationship changes.
      model.makeDirty();
    },

    /**
     * Update relation value at model.
     *
     * @method updateLookupValue
     * @param {Object} updateData Lookup parameters to update data at model (projection name, etc).
     */
    updateLookupValue: function(updateData) {
      let options = Ember.$.extend(true, {
        relationName: undefined,
        newRelationValue: undefined,
        modelToLookup: undefined
      }, updateData);
      let modelToLookup = options.modelToLookup;
      let model = modelToLookup ? modelToLookup : this.get('model');

      Ember.Logger.debug(`Flexberry Lookup Mixin::updateLookupValue ${options.relationName}`);
      model.set(options.relationName, options.newRelationValue);

      // Manually make record dirty, because ember-data does not do it when relationship changes.
      model.makeDirty();
    }
  }
});
