import DS from 'ember-data';
import EmberFlexberryDataModel from 'ember-flexberry-data/models/model';
import { attr, belongsTo, hasMany } from 'ember-flexberry-data/utils/attributes';

let Model = EmberFlexberryDataModel.extend({
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
  flag: attr('Flag'),
  number: attr('Number'),
  text: attr('Text'),
  longText: attr('Long text'),
  date: attr('Date'),
  time: attr('Time'),
  enumeration: attr('Enumeration'),
  file: attr('File'),
  master: belongsTo('integration-examples/edit-form/validation/master', 'Master', {
    text: attr('Text', {
      hidden: true
    })
  }, {
    displayMemberPath: 'text'
  }),
  masterDropdown: belongsTo('integration-examples/edit-form/validation/master-dropdown', 'Master dropdown', {
    text: attr('Text', {
      hidden: true
    })
  }, {
    displayMemberPath: 'text'
  }),
  details: hasMany('integration-examples/edit-form/readonly-mode/detail', 'Details', {
    flag: attr('Flag'),
    text: attr('Text'),
    longText: attr('Long text'),
    date: attr('Date'),
    time: attr('Time'),
    enumeration: attr('Enumeration'),
    file: attr('File'),
    master: belongsTo('integration-examples/edit-form/readonly-mode/master', 'Master', {
      text: attr('Name', {
        hidden: true
      })
    }, {
      displayMemberPath: 'name'
    }),
    masterDropdown: belongsTo('integration-examples/edit-form/validation/master-dropdown', 'Master dropdown', {
    text: attr('Text', {
      hidden: true
    })
  }, {
    displayMemberPath: 'text'
  })
  })
});

export default Model;
