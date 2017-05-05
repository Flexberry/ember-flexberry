import Ember from 'ember';
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
    },

    /**
      Handles click on flexberry-file's add button.
    */
    addButtonClick() {
      //let per = 0;
    }
  }
});
