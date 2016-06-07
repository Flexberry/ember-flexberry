import DS from 'ember-data';
import BaseModel from 'ember-flexberry/models/base';
import Proj from 'ember-flexberry-data';

let Model = BaseModel.extend({
  // Inversed relationship for aggregator.details.
  // It's not a property for flexberry-lookup component.
  aggregator: DS.belongsTo('integration-examples/edit-form/readonly-mode/aggregator', {
    inverse: 'details',
    async: false
  }),

  flag: DS.attr('boolean'),
  text: DS.attr('string'),
  date: DS.attr('date'),
  enumeration: DS.attr('integration-examples/edit-form/readonly-mode/enumeration'),
  file: DS.attr('file'),

  // This property is for flexberry-lookup component. No inverse relationship here.
  master: DS.belongsTo('integration-examples/edit-form/readonly-mode/master', {
    inverse: null,
    async: false
  })
});

// Edit form projection.
Model.defineProjection('DetailE', 'integration-examples/edit-form/readonly-mode/detail', {
  flag: Proj.attr('Flag'),
  text: Proj.attr('Text'),
  date: Proj.attr('Date'),
  enumeration: Proj.attr('Enumeration'),
  file: Proj.attr('File'),
  master: Proj.belongsTo('integration-examples/edit-form/readonly-mode/master', 'Master', {
    text: Proj.attr('Text', {
      hidden: true
    })
  }, {
    displayMemberPath: 'text'
  })
});

export default Model;
