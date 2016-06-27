import DS from 'ember-data';
import BaseModel from 'ember-flexberry/models/base';
import Proj from 'ember-flexberry-data';

let Model = BaseModel.extend({
  flag: DS.attr('boolean'),
  number: DS.attr('number'),
  text: DS.attr('string'),
  longText: DS.attr('string'),
  date: DS.attr('date'),
  enumeration: DS.attr('integration-examples/edit-form/validation/enumeration'),
  file: DS.attr('file'),

  // This property is for flexberry-lookup component. No inverse relationship here.
  master: DS.belongsTo('integration-examples/edit-form/validation/master', {
    inverse: null,
    async: false
  }),

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
    },
    longText: {
      presence: {
        message: 'Long text is required'
      }
    },
    date: {
      datetime: {
        allowBlank: false,
        messages: {
          blank: 'Date is required',
          invalid: 'Date is invalid'
        }
      }
    },
    enumeration: {
      presence: {
        message: 'Enumeration is required'
      }
    },
    file: {
      presence: {
        message: 'File is required'
      }
    },
    master: {
      presence: {
        message: 'Master is required'
      }
    }
  }
});

// Edit form projection.
Model.defineProjection('BaseE', 'integration-examples/edit-form/validation/base', {
  flag: Proj.attr('Flag'),
  number: Proj.attr('Number'),
  text: Proj.attr('Text'),
  longText: Proj.attr('Long text'),
  date: Proj.attr('Date'),
  enumeration: Proj.attr('Enumeration'),
  file: Proj.attr('File'),
  master: Proj.belongsTo('integration-examples/edit-form/validation/master', 'Master', {
    text: Proj.attr('Text', {
      hidden: true
    })
  }, {
    displayMemberPath: 'text'
  })
});

export default Model;
