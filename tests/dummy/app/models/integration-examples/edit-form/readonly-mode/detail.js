import DS from 'ember-data';
import EmberFlexberryDataModel from 'ember-flexberry-data/models/model';
import { attr, belongsTo } from 'ember-flexberry-data/utils/attributes';

let Model = EmberFlexberryDataModel.extend({
  // Inversed relationship for aggregator.details.
  // It's not a property for flexberry-lookup component.
  aggregator: DS.belongsTo('integration-examples/edit-form/readonly-mode/aggregator', {
    inverse: 'details',
    async: false
  }),

  flag: DS.attr('boolean'),
  text: DS.attr('string'),
  longText: DS.attr('string'),
  date: DS.attr('date'),
  time: DS.attr('date'),
  enumeration: DS.attr('integration-examples/edit-form/readonly-mode/enumeration'),
  file: DS.attr('file'),

  // This property is for flexberry-lookup component. No inverse relationship here.
  master: DS.belongsTo('integration-examples/edit-form/readonly-mode/master', {
    inverse: null,
    async: false
  }),
  masterDropdown: DS.belongsTo('integration-examples/edit-form/readonly-mode/master-dropdown', {
    inverse: null,
    async: false
  })
});

// Edit form projection.
Model.defineProjection('DetailE', 'integration-examples/edit-form/readonly-mode/detail', {
  flag: attr('Flag'),
  text: attr('Text'),
  longText: attr('longText'),
  date: attr('Date'),
  time: attr('Time'),
  enumeration: attr('Enumeration'),
  file: attr('File'),
  master: belongsTo('integration-examples/edit-form/readonly-mode/master', 'Master', {
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
  })
});

export default Model;
