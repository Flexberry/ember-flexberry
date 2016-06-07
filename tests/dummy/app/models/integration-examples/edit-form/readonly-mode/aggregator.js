import DS from 'ember-data';
import BaseModel from 'ember-flexberry/models/base';
import Proj from 'ember-flexberry-data';

let Model = BaseModel.extend({
  isReadonly: DS.attr('boolean'),
  votes: DS.attr('number'),
  date: DS.attr('date'),
  time: DS.attr('time'),
  text: DS.attr('string'),
  file: DS.attr('file'),
  gender: DS.attr('ember-flexberry-dummy-gender'),

  // This property is for flexberry-lookup component. No inverse relationship here.
  author: DS.belongsTo('integration-examples/edit-form/readonly-mode/master', {
    inverse: null,
    async: false
  }),
  moderator: DS.belongsTo('integration-examples/edit-form/readonly-mode/master-dropdown', {
    inverse: null,
    async: false
  }),
  moderated: DS.attr('boolean'),
  details: DS.hasMany('integration-examples/edit-form/readonly-mode/detail', {
    inverse: 'aggregator',
    async: false
  })
});

// Edit form projection.
Model.defineProjection('AggregatorE', 'integration-examples/edit-form/readonly-mode/aggregator', {
  isReadonly: Proj.attr('isReadonly'),
  votes: Proj.attr('Votes'),
  date: Proj.attr('Date'),
  time: Proj.attr('Time'),
  text: Proj.attr('Text'),
  file: Proj.attr('File'),
  gender: Proj.attr('Gender'),
  author: Proj.belongsTo('integration-examples/edit-form/readonly-mode/master', 'Author', {
    name: Proj.attr('Name', {
      hidden: true
    })
  }, {
    displayMemberPath: 'name'
  }),
  moderator: Proj.belongsTo('integration-examples/edit-form/readonly-mode/master-dropdown', 'Moderator', {
    name: Proj.attr('Name', {
      hidden: true
    })
  }, {
    displayMemberPath: 'name'
  }),
  moderated: Proj.attr('Moderated'),
  details: Proj.hasMany('integration-examples/edit-form/readonly-mode/detail', 'Details', {
    flag: Proj.attr('Flag'),
    text: Proj.attr('Text'),
    date: Proj.attr('Date'),
    enumeration: Proj.attr('Enumeration'),
    file: Proj.attr('File'),
    master: Proj.belongsTo('integration-examples/edit-form/readonly-mode/master', 'Master', {
      text: Proj.attr('Name', {
        hidden: true
      })
    }, {
      displayMemberPath: 'name'
    })
  })
});

export default Model;
