import Ember from 'ember';
import EditFormRoute from './edit-form';

export default EditFormRoute.extend({
  activate() {
    this._super(...arguments);
  },

  model: function() {
    let flexberryDetailInteractionService = this.get('flexberryDetailInteractionService');
    let modelCurrentNotSaved = flexberryDetailInteractionService.get('modelCurrentNotSaved');
    let modelSelectedDetail = flexberryDetailInteractionService.get('modelSelectedDetail');
    flexberryDetailInteractionService.set('modelCurrentNotSaved', undefined);
    flexberryDetailInteractionService.set('modelSelectedDetail', undefined);

    if (modelCurrentNotSaved) {
      return modelCurrentNotSaved;
    }

    if (modelSelectedDetail) {
      return modelSelectedDetail;
    }

    // NOTE: record.id is null.
    var record = this.store.createRecord(this.modelName);
    return record;
  },

  renderTemplate: function(controller, model) {
    var templateName = this.get('templateName');
    Ember.assert('Template name must be defined.', templateName);
    this.render(templateName, {
      model,
      controller,
    });
  }
});
