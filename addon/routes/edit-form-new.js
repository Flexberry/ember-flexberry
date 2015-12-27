import EditFormRoute from './edit-form';

export default EditFormRoute.extend({
  model: function() {
    // NOTE: record.id is null.
    var record = this.store.createRecord(this.modelName);
    return record;
  },

  renderTemplate: function(controller, model) {
    this.render(this.modelName, {
      model: model,
      controller
    });
  },

  deactivate: function() {
    var model = this.get('controller').get('model');
    model.rollback();

    if (model.get('isNew')) {
      model.deleteRecord();
    }
  }
});
