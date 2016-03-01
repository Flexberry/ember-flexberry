import EditFormRoute from './edit-form';

export default EditFormRoute.extend({
  activate() {
    this._super(...arguments);
  },

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
  }
});
