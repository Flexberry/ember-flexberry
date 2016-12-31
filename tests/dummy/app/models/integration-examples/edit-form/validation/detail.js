import DS from 'ember-data';
import { Projection } from 'ember-flexberry-data';

let Model = Projection.Model.extend({
  // Inversed relationship for integration-examples/edit-form/validation/base.details.
  // It's not a property for flexberry-lookup component.
  aggregator: DS.belongsTo('integration-examples/edit-form/validation/base', {
    inverse: 'details',
    async: false
  }),

  flag: DS.attr('boolean'),
  number: DS.attr('number'),
  text: DS.attr('string'),

  // Model validation rules.
  validations: {
    flag: {
      presence: {
        message: 'Flag is required'
      },
      inclusion: {
        in: [true],
        message: 'Flag must be \'true\' only'
      }
    },
    number: {
      presence: {
        message: 'Number is required'
      },
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
    text: {
      presence: {
        message: 'Text is required'
      },
      allowBlank: false,
      length: {
        minimum: 5,
        messages: {
          tooShort: 'Text length must be >= 5'
        }
      }
    }
  }
});

// Edit form projection.
Model.defineProjection('DetailE', 'integration-examples/edit-form/validation/detail', {
  flag: Projection.attr('Flag'),
  number: Projection.attr('Number'),
  text: Projection.attr('Text')
});

export default Model;
