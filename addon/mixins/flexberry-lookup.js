/**
  @module ember-flexberry
 */

import Ember from 'ember';

import QueryBuilder from 'ember-flexberry-data/query/builder';

/**
  Mixin for controller, for support FlexberryLookup component.

  TODO: Rename file, add 'controller' word into filename.

  @class FlexberryLookupController
  @uses <a href="http://emberjs.com/api/classes/Ember.Mixin.html">Ember.Mixin</a>
 */
export default Ember.Mixin.create({
  /**
    Settings for modal window.

    Structure object:
    - **controllerName** - Controller name.
    - **template** - Template name for show in modal window.
    - **contentTemplate** - Template name for show data.
    - **loaderTemplate** - Template name for show while data loading.

    @property lookupSettings
    @type Object
   */
  lookupSettings: {
    controllerName: undefined,
    template: undefined,
    contentTemplate: undefined,
    loaderTemplate: undefined
  },

  /**
    Controller to show modal window.

    @property lookupController
    @type Ember.Controller
   */
  lookupController: undefined,

  actions: {
    /**
      Handlers action from FlexberryLookup choose action.

      @method actions.showLookupDialog
      @param {Object} chooseData Lookup parameters: { projection, relationName, title, predicate, modelToLookup, sizeClass }.
     */
    showLookupDialog(chooseData) {
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
      Handlers corresponding route's willTransition action.
      It sends message about transition to showing lookup modal window controller.

      @method actions.routeWillTransition
     */
    routeWillTransition() {
      this.get('lookupController').send('routeWillTransition');
    },

    /**
      Handlers action from FlexberryLookup remove action.

      @method actions.removeLookupValue
      @param {Object} removeData Lookup parameters: { relationName, modelToLookup }.
     */
    removeLookupValue(removeData) {
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
      Update relation value at model.

      @method actions.updateLookupValue
      @param {Object} updateData Lookup parameters to update data at model: { relationName, newRelationValue, modelToLookup }.
     */
    updateLookupValue(updateData) {
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
    },
  },
});
