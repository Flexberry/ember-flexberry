import DS from 'ember-data';
import { Projection } from 'ember-flexberry-data';

let Model = Projection.Model.extend({
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
  flag: Projection.attr('Flag'),
  number: Projection.attr('Number'),
  text: Projection.attr('Text'),
  longText: Projection.attr('Long text'),
  date: Projection.attr('Date'),
  time: Projection.attr('Time'),
  enumeration: Projection.attr('Enumeration'),
  file: Projection.attr('File'),
  master: Projection.belongsTo('integration-examples/edit-form/validation/master', 'Master', {
    text: Projection.attr('Text', {
      hidden: true
    })
  }, {
    displayMemberPath: 'text'
  }),
  masterDropdown: Projection.belongsTo('integration-examples/edit-form/validation/master-dropdown', 'Master dropdown', {
    text: Projection.attr('Text', {
      hidden: true
    })
  }, {
    displayMemberPath: 'text'
  }),
  details: Projection.hasMany('integration-examples/edit-form/readonly-mode/detail', 'Details', {
    flag: Projection.attr('Flag'),
    text: Projection.attr('Text'),
    date: Projection.attr('Date'),
    enumeration: Projection.attr('Enumeration'),
    file: Projection.attr('File'),
    master: Projection.belongsTo('integration-examples/edit-form/readonly-mode/master', 'Master', {
      text: Projection.attr('Name', {
        hidden: true
      })
    }, {
      displayMemberPath: 'name'
    })
  })
});

export default Model;
