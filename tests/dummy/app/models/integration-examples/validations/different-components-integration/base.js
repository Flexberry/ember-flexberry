import DS from 'ember-data';
import BaseModel from 'ember-flexberry/models/base';
import Proj from 'ember-flexberry-data';

let Model = BaseModel.extend({
  votes: DS.attr('number'),
  date: DS.attr('date'),
  text: DS.attr('string'),
  gender: DS.attr('ember-flexberry-dummy-gender'),

  // This property is for flexberry-lookup component. No inverse relationship here.
  author: DS.belongsTo('ember-flexberry-dummy-application-user', {
    inverse: null,
    async: false
  }),
  moderated: DS.attr('boolean'),

  // Model validation rules.
  validations: {
    votes: { presence: { message: 'Required field' } },
    date: {
      datetime: { allowBlank: false, messages: { blank: 'Your date can\'t be blank', invalid: 'Please input valid date' } }
    },
    text: { presence: { message: 'Required field' } },
    gender: { presence: { message: 'Required field' } },
    author: { presence: { message: 'Required field' } },
    moderated: { presence: { message: 'Required field' } }
  }
});

// Edit form projection.
Model.defineProjection('BaseE', 'integration-examples/validations/different-components-integration/base', {
  votes: Proj.attr('Votes'),
  date: Proj.attr('Date'),
  text: Proj.attr('Text'),
  author: Proj.belongsTo('ember-flexberry-dummy-application-user', 'Author', {
    name: Proj.attr('Name', {
      hidden: true
    })
  }, {
    displayMemberPath: 'name'
  }),
  gender: Proj.attr('Gender'),
  moderated: Proj.attr('Moderated')
});

export default Model;
