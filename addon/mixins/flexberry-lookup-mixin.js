/**
 * @module ember-flexberry
 */

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

      let query = this.store.adapterFor(relatedToType).getLimitFunctionQuery(limitFunction, projectionName);
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

      // manually set isDirty flag, because its not working now when change relation props
      // no check for 'old' and 'new' lookup data equality, because ember will do it automatically after bug fix
      model.send('becomeDirty');
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
      let relationName = options.relationName;
      let newRelationValue = options.newRelationValue;
      let modelToLookup = options.modelToLookup;
      let model = modelToLookup ? modelToLookup : this.get('model');
      let relationType = this._getRelationType(model, relationName);
      var payload = {};
      payload[relationType + 's'] = [newRelationValue];
      this.store.pushPayload(relationType, payload);
      let realRelationValue = this.store.peekRecord(relationType, newRelationValue[this.store.serializerFor(relationType).get('primaryKey')]);

      model.set(relationName, realRelationValue);

      // manually set isDirty flag, because its not working now when change relation props
      // no check for 'old' and 'new' lookup data equality, because ember will do it automatically after bug fix
      model.send('becomeDirty');
    },

    /**
     * Forms url to get all availible entities of certain relation.
     *
     * @method getLookupAutocompleteUrl
     * @param {String} relationName Elements for this relation will be searched.
     * @return {Object} Formed url.
     */
    getLookupAutocompleteUrl: function(relationName) {
      var relatedToType = this._getRelationType(this.get('model'), relationName);
      let url = this.store.adapterFor(relatedToType).getUrlForTypeQuery(relatedToType);
      return url;
    },

    /**
     * Forms query parameters by lookup autocomplete parameters.
     *
     * @method getAutocompleteLookupQueryOptions
     * @param {Object} lookupParameters Lookup autocomplete parameters (current limit function, etc).
     * @return {Object} Formed query parameters.
     */
    getAutocompleteLookupQueryOptions: function(lookupParameters) {
      let options = Ember.$.extend(true, {
        relationName: undefined
      }, lookupParameters);

      let relationName = options.relationName;
      let relationType = this._getRelationType(this.get('model'), relationName);
      let queryOptions = this.store.adapterFor(relationType).getQueryOptionsForAutocompleteLookup(lookupParameters);
      return queryOptions;
    }
  },

  /**
   * Gets related object type by relation name from specified model.
   *
   * @method _getRelationType
   * @param {String} model Specified model to get relation from.
   * @param {String} relationName Relation name.
   * @return {String} Related object type.
   * @throws {Error} Throws error if relation was not found at model.
   */
  _getRelationType: function(model, relationName) {
    // Get ember static function to get relation by name.
    var relationshipsByName = Ember.get(model.constructor, 'relationshipsByName');

    // Get relation property from model.
    var relation = relationshipsByName.get(relationName);
    if (!relation) {
      throw new Error(`No relation with '${relationName}' name defined in '${model.constructor.modelName}' model.`);
    }

    let relationType = relation.type;
    return relationType;
  }
});
