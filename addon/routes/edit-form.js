/**
 * @module ember-flexberry
 */

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
  model: function(params, transition) {
    this._super.apply(this, arguments);

    let modelName = this.get('modelName');
    let modelProjName = this.get('modelProjection');

    // Get data from service in order to decide if it is necessary to reload data or not.
    // If already visited detail's route is observed or it is come back to agregators's route,
    // it is not necessary (otherwise data merge with loaded data can occur occasionally).
    let flexberryDetailInteractionService = this.get('flexberryDetailInteractionService');
    let modelCurrentNotSaved = flexberryDetailInteractionService.get('modelCurrentNotSaved');
    let modelSelectedDetail = flexberryDetailInteractionService.get('modelSelectedDetail');
    let needReload = !(modelCurrentNotSaved || (modelSelectedDetail && modelSelectedDetail.get('hasDirtyAttributes')));

    // TODO: now 'findRecord' at ember-flexberry-projection not support 'reload: false' flag.
    let findRecordParameters = needReload ? { reload: needReload, projection: modelProjName } : undefined;

    // :id param defined in router.js
    return this.store.findRecord(modelName, params.id, findRecordParameters);
  },

  resetController: function(controller, isExisting, transition) {
    this._super.apply(this, arguments);
    let keptAgregators = controller.get('modelCurrentAgregators');

    controller.send('dismissErrorMessages');
    controller.set('modelCurrentAgregatorPathes', undefined);
    controller.set('modelCurrentAgregators', undefined);

    // If flag 'modelNoRollBack' is set, leave current model as is and remove flag.
    if (controller.get('modelNoRollBack') === true) {
      controller.set('modelNoRollBack', false);
      return;
    }

    // If flag 'modelNoRollBack' is not set, we have to roll back this model and its agregators.
    let modelsToRollBack;
    let model = controller.get('model');
    if (this.get('flexberryDetailInteractionService').hasValues(keptAgregators)) {
      keptAgregators.push(model);
      keptAgregators.reverse();
      modelsToRollBack = keptAgregators;
    } else {
      modelsToRollBack = [model];
    }

    // Roll back all found agregators and its has-many relations.
    modelsToRollBack.forEach(function(processedModel) {
      controller.rollbackHasManyRelationships(processedModel);
      if (processedModel) {
        processedModel.rollbackAttributes();
      }
    });
  },

  setupController: function(controller, model) {
    this._super(...arguments);

    // Define 'modelProjection' for controller instance.
    let modelClass = model.constructor;
    let modelProjName = this.get('modelProjection');
    let proj = modelClass.projections.get(modelProjName);
    controller.set('modelProjection', proj);

    let flexberryDetailInteractionService = this.get('flexberryDetailInteractionService');
    let modelCurrentAgregatorPath = flexberryDetailInteractionService.get('modelCurrentAgregatorPathes');
    let modelCurrentAgregator = flexberryDetailInteractionService.get('modelCurrentAgregators');
    let modelLastUpdatedDetail = flexberryDetailInteractionService.get('modelLastUpdatedDetail');
    let saveBeforeRouteLeave = flexberryDetailInteractionService.get('saveBeforeRouteLeave');

    flexberryDetailInteractionService.set('modelSelectedDetail', undefined);
    flexberryDetailInteractionService.set('modelCurrentAgregators', undefined);
    flexberryDetailInteractionService.set('modelCurrentAgregatorPathes', undefined);
    flexberryDetailInteractionService.set('saveBeforeRouteLeave', undefined);

    flexberryDetailInteractionService.set('modelCurrentNotSaved', undefined);
    flexberryDetailInteractionService.set('modelLastUpdatedDetail', undefined);

    if (modelLastUpdatedDetail &&
          ((modelLastUpdatedDetail.get('isDeleted') && modelLastUpdatedDetail.get('id')) ||
              modelLastUpdatedDetail.get('hasDirtyAttributes'))) {
      // If detail changed, agregator has to be marked as changed.
      model.makeDirty();
    }

    let returnToAgregatorRoute = controller.get('returnToAgregatorRoute');
    if (!returnToAgregatorRoute) {
      // There is no need to set parameters to return to agregator.
      return;
    }

    if (flexberryDetailInteractionService.hasValues(modelCurrentAgregatorPath)) {
      controller.set('modelCurrentAgregatorPathes', modelCurrentAgregatorPath);
      controller.set('modelCurrentAgregators', modelCurrentAgregator);
      controller.set('saveBeforeRouteLeave', saveBeforeRouteLeave);
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
