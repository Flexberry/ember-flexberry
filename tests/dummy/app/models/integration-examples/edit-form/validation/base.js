import DS from 'ember-data';
import EmberFlexberryDataModel from 'ember-flexberry-data/models/model';
import { attr, belongsTo, hasMany } from 'ember-flexberry-data/utils/attributes';
import { validator, buildValidations } from 'ember-cp-validations';

const Validations = buildValidations({
  flag: {
    lazy: false,
    validators: [
      validator('presence', {
        presence: true,
        message: 'Flag is required',
      }),
      validator('inclusion', {
        in: [true],
        message: `Flag must be 'true' only`,
      }),
    ],
  },
  number: {
    lazy: false,
    validators: [
      validator('presence', {
        presence: true,
        message: 'Number is required',
      }),
      validator('number', {
        allowString: true,
        odd: true,
        integer: true,
        message(type) {
          let message = 'Number is invalid';
          if (type === 'odd') {
            message = 'Number must be an odd';
          }

          return message;
        },
      }),
    ],
  },
  text: {
    lazy: false,
    validators: [
      validator('presence', {
        presence: true,
        message: 'Text is required',
      }),
      validator('length', {
        allowNone: false,
        min: 5,
        message: 'Text length must be >= 5',
      }),
    ],
  },
  longText: validator('presence', {
    presence: true,
    message: 'Long text is required',
  }),
  date: [
    validator('presence', {
      presence: true,
      message: 'Date is required',
    }),
    validator('date', {
      allowBlank: false,
      message: 'Date is invalid',
    })
  ],
  enumeration: validator('presence', {
    presence: true,
    message: 'Enumeration is required',
  }),
  file: validator('presence', {
    presence: true,
    message: 'File is required',
  }),
  master: validator('presence', {
    presence: true,
    message: 'Master is required',
  }),
  details: validator('has-many'),
});

let Model = EmberFlexberryDataModel.extend(Validations, {
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

  // This property is for flexberry-groupedit component.
  details: DS.hasMany('integration-examples/edit-form/validation/detail', {
    inverse: 'aggregator',
    async: false
  }),
});

// Edit form projection.
Model.defineProjection('BaseE', 'integration-examples/edit-form/validation/base', {
  flag: attr('Flag'),
  number: attr('Number'),
  text: attr('Text'),
  longText: attr('Long text'),
  date: attr('Date'),
  enumeration: attr('Enumeration'),
  file: attr('File'),
  master: belongsTo('integration-examples/edit-form/validation/master', 'Master', {
    text: attr('Text', {
      hidden: true
    })
  }, {
    displayMemberPath: 'text'
  }),
  details: hasMany('integration-examples/edit-form/validation/detail', 'details', {
    flag: attr('Flag'),
    number: attr('Number'),
    text: attr('Text')
  })
});

export default Model;
