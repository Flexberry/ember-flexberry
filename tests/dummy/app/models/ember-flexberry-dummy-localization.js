import DS from 'ember-data';
import EmberFlexberryDataModel from 'ember-flexberry-data/models/model';
import { attr } from 'ember-flexberry-data/utils/attributes';

var Model = EmberFlexberryDataModel.extend({
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
  name: attr('Name')
});

// List form projection.
Model.defineProjection('LocalizationL', 'ember-flexberry-dummy-localization', {
  name: attr('Name')
});

export default Model;
