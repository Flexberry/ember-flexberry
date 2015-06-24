import EditFormRoute from 'prototype-ember-cli-application/routes/edit-form';

export default EditFormRoute.extend({
  model: function() {
    // NOTE: record.id is null.
    var record = this.store.createProjectedRecord(this.modelTypeKey, this.get('modelProjection'));
    return record;
  },

  renderTemplate: function(controller, model) {
    this.render(this.modelTypeKey, {
      model: model
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
