import DS from 'ember-data';
import BaseModel from 'ember-flexberry/models/base';
import Proj from 'ember-flexberry-data';

let Model = BaseModel.extend({
  flag: DS.attr('boolean'),
  number: DS.attr('number'),
  text: DS.attr('string'),
  longText: DS.attr('string'),
  date: DS.attr('date'),
  time: DS.attr('date'),
  enumeration: DS.attr('integration-examples/edit-form/validation/enumeration'),
  file: DS.attr('file'),

  // This property is for flexberry-lookup component. No inverse relationship here.
  master: DS.belongsTo('integration-examples/edit-form/validation/master', {
    inverse: null,
    async: false
  }),

  // This property is for flexberry-lookup component (in dropdown-mode). No inverse relationship here.
  masterDropdown: DS.belongsTo('integration-examples/edit-form/readonly-mode/master-dropdown', {
    inverse: null,
    async: false
  }),

  details: DS.hasMany('integration-examples/edit-form/readonly-mode/detail', {
    inverse: 'aggregator',
    async: false
  })
});

// Edit form projection.
Model.defineProjection('AggregatorE', 'integration-examples/edit-form/readonly-mode/aggregator', {
  flag: Proj.attr('Flag'),
  number: Proj.attr('Number'),
  text: Proj.attr('Text'),
  longText: Proj.attr('Long text'),
  date: Proj.attr('Date'),
  time: Proj.attr('Time'),
  enumeration: Proj.attr('Enumeration'),
  file: Proj.attr('File'),
  master: Proj.belongsTo('integration-examples/edit-form/validation/master', 'Master', {
    text: Proj.attr('Text', {
      hidden: true
    })
  }, {
    displayMemberPath: 'text'
  }),
  masterDropdown: Proj.belongsTo('integration-examples/edit-form/validation/master-dropdown', 'Master dropdown', {
    text: Proj.attr('Text', {
      hidden: true
    })
  }, {
    displayMemberPath: 'text'
  }),
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
