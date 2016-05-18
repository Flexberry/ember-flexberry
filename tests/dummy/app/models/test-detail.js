import DS from 'ember-data';
import BaseModel from 'ember-flexberry/models/base';
import Proj from 'ember-flexberry-data';

var Model = BaseModel.extend({
  // Inversed relationship for test-aggregator.details.
  // It's not a property for Lookup component.
  aggregator: DS.belongsTo('test-aggregator', { inverse: 'details', async: false }),

  flag: DS.attr('boolean'),
  text: DS.attr('string'),
  date: DS.attr('date'),
  enumeration: DS.attr('test-enumeration'),
  file: DS.attr('file'),

  // This property for Lookup component. No inverse relationship here.
  master: DS.belongsTo('test-master', { inverse: null, async: false })
});

Model.defineProjection('TestDetailE', 'test-detail', {
  flag: Proj.attr('Flag'),
  text: Proj.attr('Text'),
  date: Proj.attr('Date'),
  enumeration: Proj.attr('Enumeration'),
  file: Proj.attr('File'),
  master: Proj.belongsTo('test-master', 'Master', {
    text: Proj.attr('Text', { hidden: true })
  }, {
    displayMemberPath: 'text'
  })
});

export default Model;
