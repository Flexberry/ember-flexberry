import DS from 'ember-data';
import BaseModel from 'ember-flexberry/models/base';
import Proj from 'ember-flexberry-data';

var Model = BaseModel.extend({
  enumeration: DS.attr('test-enumeration'),

  // This property for GroupEdit component.
  // Inverse relationship is necessary here.
  details: DS.hasMany('test-detail', { inverse: 'aggregator', async: false })
});

Model.defineProjection('TestAggregatorE', 'test-aggregator', {
  details: Proj.hasMany('test-detail', 'Details', {
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
  })
});

export default Model;
