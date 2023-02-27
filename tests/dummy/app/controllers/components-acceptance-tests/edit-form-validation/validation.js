import Ember from 'ember';
import moment from 'moment';
import EditFormController from 'ember-flexberry/controllers/edit-form';

export default EditFormController.extend({
  /**
    Lookup events service.
  */
  lookupEvents: Ember.inject.service('lookup-events'),

  actions: {
    /**
      Handles click on lookup's choose button.
    */
    showLookupDialog() {
      // Create new master & add to model.
      let master = this.get('store').createRecord('integration-examples/edit-form/validation/master', { text: 'Master text' });
      this.get('model').set('master', master);

      this.get('lookupEvents').lookupDialogOnHiddenTrigger('IntegrationExamplesValidationsMaster');

      // Create temp file and add to model.
      let tempFile = { fileName: 'Ждём НГ.png', fileSize: '27348', fileMimeType: '27348' };
      this.get('model').set('file', tempFile);

      // Set date.
      this.get('model').set('date', moment());
    }
  }
});
