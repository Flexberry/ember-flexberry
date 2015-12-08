import Ember from 'ember';
import EmberValidations from 'ember-validations';
import ValidationData from '../objects/validation-data';

export default Ember.Mixin.create(EmberValidations, {
  // Validation rules.
  validations: {},

  save: function() {
    if (!this.get('isDeleted')) {
      var validationData = ValidationData.create({
        noChanges: !this.get('isDirty'),
        anyErrors: this.get('isInvalid')
      });
      validationData.fillErrorsFromProjectedModel(this);

      if (validationData.noChanges || validationData.anyErrors) {
        return new Ember.RSVP.Promise(function(resolve, reject) {
          reject(validationData);
        });
      }
    }

    return this._super.apply(this, arguments);
  }
});
