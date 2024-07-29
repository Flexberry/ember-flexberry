import DS from 'ember-data';
import EmberFlexberryDataModel from 'ember-flexberry-data/models/model';
import { attr } from 'ember-flexberry-data/utils/attributes';
import { validator, buildValidations } from 'ember-cp-validations';

const Validations = buildValidations({
  flag: {
    lazy: false,
    validators: [
      validator('presence', {
        presence: true,
        message: 'Detail. Flag is required',
      }),
      validator('inclusion', {
        in: [true],
        message: `Detail. Flag must be 'true' only`,
      }),
    ],
  },
  number: {
    lazy: false,
    validators: [
      validator('presence', {
        presence: true,
        message: 'Detail. Number is required',
      }),
      validator('number', {
        allowString: true,
        odd: true,
        integer: true,
        message: 'Detail. Number is invalid',
      }),
    ],
  },
  text: {
    lazy: false,
    validators: [
      validator('presence', {
        presence: true,
        message: 'Detail. Text is required',
      }),
      validator('length', {
        allowNone: false,
        min: 5,
        message: 'Detail. Text length must be >= 5',
      }),
    ],
  },
});

let Model = EmberFlexberryDataModel.extend(Validations, {
  // Inversed relationship for integration-examples/edit-form/validation/base.details.
  // It's not a property for flexberry-lookup component.
  aggregator: DS.belongsTo('integration-examples/edit-form/validation/base', {
    inverse: 'details',
    async: false
  }),

  flag: DS.attr('boolean'),
  number: DS.attr('number'),
  text: DS.attr('string'),
});

// Edit form projection.
Model.defineProjection('DetailE', 'integration-examples/edit-form/validation/detail', {
  flag: attr('Flag'),
  number: attr('Number'),
  text: attr('Text')
});

export default Model;
