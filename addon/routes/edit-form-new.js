import Ember from 'ember';
import EditFormRoute from './edit-form';

export default EditFormRoute.extend({
  activate() {
    this._super(...arguments);
  },

  model: function(params, transition) {
    if (transition && transition.queryParams && transition.queryParams.returnFromDetailName) {
      let returnFromDetailName = transition.queryParams.returnFromDetailName;
      let childController = this.controllerFor(this.newRoutePath(returnFromDetailName));
      if (childController) {
        let currentAgregatorRecord = childController.get('modelAgregatorObject');
        if (currentAgregatorRecord) {
          childController.set('modelAgregatorObject', undefined);
          return currentAgregatorRecord;
        }
      }
    }

    // Get model's agregator.
    let modelConstructor = this.store.modelFor(this.modelName);
    let modelAgregatorName = modelConstructor.modelAgregator;

    if (modelAgregatorName) {
      // Check if there is relation with stated name.
      let relationshipsByName = Ember.get(modelConstructor, 'relationshipsByName');
      var modelAgregator = relationshipsByName.get(modelAgregatorName);
      if (!modelAgregator) {
        throw new Error(`No agregator with '${modelAgregatorName}' name defined in '${modelConstructor.modelName}' model.`);
      }

      let modelAgregatorType = modelAgregator.type;
      let parentController = this.controllerFor(modelAgregatorType);
      if (parentController) {
        // TODO: may be from .new.
        let selectedDetailRecord = parentController.get('modelSelectedDetail');
        if (selectedDetailRecord) {
          parentController.set('modelSelectedDetail', undefined);
          return selectedDetailRecord;
        }
      }
    }

    // NOTE: record.id is null.
    var record = this.store.createRecord(this.modelName);
    return record;
  },

  renderTemplate: function(controller, model) {
    this.render(this.modelName, {
      model: model,
      controller
    });
  }
});
