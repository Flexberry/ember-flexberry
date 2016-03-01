/**
 * @module ember-flexberry
 */

import Ember from 'ember';
import ProjectedModelFormRoute from './projected-model-form';
import FlexberryGroupeditRouteMixin from '../mixins/flexberry-groupedit-route';

/**
 * Base route for the Edit Forms.

 This class re-exports to the application as `/routes/edit-form`.
 So, you can inherit from `./edit-form`, even if file `app/routes/edit-form.js`
 is not presented in the application.

 Example:
 ```js
 // app/routes/employee.js
 import EditFormRoute from './edit-form';
 export default EditFormRoute.extend({
 });
 ```

 If you want to add some common logic on all Edit Forms, you can define
 (actually override) `app/routes/edit-form.js` as follows:
 ```js
 // app/routes/edit-form.js
 import EditFormRoute from 'ember-flexberry/routes/edit-form';
 export default EditFormRoute.extend({
 });
 ```

 * @class EditFormRoute
 * @extends ProjectedModelFormRoute
 * @uses FlexberryGroupeditRouteMixin
 */
export default ProjectedModelFormRoute.extend(FlexberryGroupeditRouteMixin, {
  /**
   * Flag to enable return to agregator's path if possible.
   *
   * @property returnToAgregatorRoute
   * @type Boolean
   * @default true
   */
  returnToAgregatorRoute: true,

  model: function(params, transition) {
    this._super.apply(this, arguments);

    let modelName = this.get('modelName');
    let modelProjName = this.get('modelProjection');

    // :id param defined in router.js
    return this.store.findRecord(modelName, params.id, {
      reload: true,
      projection: modelProjName
    });
  },

  resetController: function(controller, isExisting, transition) {
    this._super.apply(this, arguments);

    controller.send('dismissErrorMessages');

    // If flag 'modelNoRollBack' is set, leave current model as is and remove flag.
    if (controller.get('modelNoRollBack') === true) {
      controller.set('modelNoRollBack', false);
      return;
    }

    controller.rollbackHasManyRelationships();
    let model = controller.get('model');
    if (model && model.get('hasDirtyAttributes')) {
      model.rollbackAttributes();
    }
  },

  setupController: function(controller, model) {
    this._super(...arguments);

    // Define 'modelProjection' for controller instance.
    let modelClass = model.constructor;
    let modelProjName = this.get('modelProjection');
    let proj = modelClass.projections.get(modelProjName);
    controller.set('modelProjection', proj);

    // Get model's agregator.
    let modelAgregatorName = model.get('modelAgregator');
    let returnToAgregatorRoute = this.get('returnToAgregatorRoute');

    if (!returnToAgregatorRoute || !modelAgregatorName) {
      // There is no need to set parameters to return to agregator.
      return;
    }

    // Check if there is relation with stated name.
    let relationshipsByName = Ember.get(model.constructor, 'relationshipsByName');
    var modelAgregator = relationshipsByName.get(modelAgregatorName);
    if (!modelAgregator) {
      throw new Error(`No agregator with '${modelAgregatorName}' name defined in '${model.constructor.modelName}' model.`);
    }

    let modelIsNew = model.get('isNew');
    let modelAgregatorType = modelAgregator.type;
    let parentModel = this.modelFor(modelAgregatorType);
    let newParentRoutePath = this.newRoutePath(modelAgregatorType);

    // If we came from new model's route, check on special path.
    if (!parentModel && modelIsNew) {
      parentModel = this.modelFor(newParentRoutePath);
    }

    if (parentModel) {
      if (modelIsNew) {
        model.set(modelAgregatorName, parentModel);
        let parentModelId = parentModel.get('id');
        if (parentModelId) {
          controller.set('modelAgregatorId', parentModel.get('id'));
          controller.set('modelAgregatorRoute', modelAgregatorType);
        } else {
          controller.set('modelAgregatorRoute', newParentRoutePath);
        }
      } else {
        let currentParent = model.get(modelAgregatorName);
        if (!currentParent || !currentParent.get('id')) {
          throw new Error(`There is saved detail model '${model.constructor.modelName}' with empty or not saved agregator.`);
        }

        controller.set('modelAgregatorId', currentParent.get('id'));
        controller.set('modelAgregatorRoute', modelAgregatorType);
      }
    }
  },

  actions: {
    /**
     * Handles willTransition action (this action is fired at the beginning of any attempted transition).
     * It sends message about transition to corresponding controller.
     *
     * @method willTransition
     */
    willTransition: function(transition) {
      this._super(transition);
      this.controller.send('routeWillTransition');
    }
  }
});
