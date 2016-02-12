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

    // :id param defined in router.js
    return this.store.findRecord(modelName, params.id, {
      reload: true,
      projection: modelProjName
    });
  },

  resetController: function(controller, isExisting, transition) {
    this._super.apply(this, arguments);

    controller.send('dismissErrorMessages');
    var model = controller.get('model');
    this._rollbackDetails(model);
    if (model && model.get('hasDirtyAttributes')) {
      model.rollbackAttributes();
    }
  },

  setupController: function(controller, model) {
    // Call _super for default behavior.
    this._super(controller, model);

    // Define 'modelProjection' for controller instance.
    let modelClass = model.constructor;
    let modelProjName = this.get('modelProjection');
    let proj = modelClass.projections.get(modelProjName);
    controller.set('modelProjection', proj);
    controller.set('modelProjectionName', modelProjName);
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
  },

  _rollbackDetails: function(model) {
    var modelClass = model.constructor;
    var modelProjName = this.get('modelProjection');
    var projection = modelClass.projections.get(modelProjName);
    var attributes = projection.attributes;
    for (var attrName in attributes) {
      if (!attributes.hasOwnProperty(attrName)) {
        continue;
      }

      var attr = attributes[attrName];
      if (attr.kind === 'hasMany') {
        var detailModels = model.get(attrName);
        for (var i = 0; i < detailModels.get('length'); i++) {
          if (detailModels.objectAt(i).get('hasDirtyAttributes')) {
            detailModels.objectAt(i).rollbackAttributes();
          }
        }
      }
    }

    var _this = this;
    this.get('deletedRecords').forEach(function(deletedRecord) {
      _this.store.findRecord(deletedRecord.model, deletedRecord.id, { reload: false }).then(function(record) {
        record.rollbackAttributes();
      });
    });
    this.get('deletedRecords').clear();
  }
});
