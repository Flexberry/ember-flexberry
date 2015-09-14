import Ember from 'ember';
import EmberValidations from 'ember-validations';
import DS from 'ember-data';
import Projection from '../utils/projection';
import ValidationData from '../objects/validation-data';

var Model = DS.Model.extend(EmberValidations, {
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

Model.reopenClass({
  projections: null,

  defineProjection: function(projectionName, modelName, attributes) {
    let proj = Projection.create(modelName, attributes);

    if (!this.projections) {
      this.reopenClass({
        projections: Ember.Object.create()
      });
    }

    this.projections.set(projectionName, proj);
    return proj;
  }
});

export default Model;
