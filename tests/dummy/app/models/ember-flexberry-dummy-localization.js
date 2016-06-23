import DS from 'ember-data';
import BaseModel from 'ember-flexberry/models/base';
import Proj from 'ember-flexberry-data';

var Model = BaseModel.extend({
  name: DS.attr('string'),

  // Model validation rules.
  validations: {
    name: {
      presence: {
        message: 'Name is required'
      }
    }
  }
});

// Edit form projection.
Model.defineProjection('LocalizationE', 'ember-flexberry-dummy-localization', {
  name: Proj.attr('Name')
});

// List form projection.
Model.defineProjection('LocalizationL', 'ember-flexberry-dummy-localization', {
  name: Proj.attr('Name')
});

export default Model;
