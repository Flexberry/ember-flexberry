import Ember from 'ember';
import EditFormController from 'ember-flexberry/controllers/edit-form';

export default EditFormController.extend({
  /**
    Lookup events service.
  */
  lookupEvents: Ember.inject.service('lookup-events'),

  validations: {
    'model.flag': {
      presence: { message: 'Flag is required' },
      inclusion: {
        in: [true],
        message: 'Flag must be \'true\' only'
      }
    },
    'model.number': {
      presence: { message: 'Number is required' },
      numericality: {
        odd: true,
        onlyInteger: true,
        messages: {
          numericality: 'Number is invalid',
          odd: 'Number must be an odd',
          onlyInteger: 'Number must be an integer'
        }
      }
    },
    'model.text': {
      presence: { message: 'Text is required' },
      allowBlank: false,
      length: {
        minimum: 5,
        messages: { tooShort: 'Text length must be >= 5' }
      }
    },
    'model.longText': { presence: { message: 'Long text is required' } },
    'model.date': {
      datetime: {
        allowBlank: false,
        messages: {
          blank: 'Date is required',
          invalid: 'Date is invalid'
        }
      }
    },
    'model.enumeration': { presence: { message: 'Enumeration is required' } },
    'model.file': { presence: { message: 'File is required' } },
    'model.master': { presence: { message: 'Master is required' } },
  },

  actions: {
    /**
      Handles click on lookup's choose button.
    */
    showLookupDialog() {
      // Create new master & add to model.
      let master = this.get('store').createRecord('integration-examples/edit-form/validation/master', { text: 'Master text' });
      this.get('model').set('master', master);

      this.get('lookupEvents').lookupDialogOnHiddenTrigger('IntegrationExamplesValidationsMaster');
    }
  }
});
