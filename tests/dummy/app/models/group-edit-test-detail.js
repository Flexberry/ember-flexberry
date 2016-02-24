import DS from 'ember-data';
import BaseModel from 'ember-flexberry/models/base';
import Proj from 'ember-flexberry-projections';

var Model = BaseModel.extend({
  aggregator: DS.belongsTo('group-edit-test', { inverse: null, async: false }),
  flag: DS.attr('boolean'),
  text: DS.attr('string'),
  date: DS.attr('date'),
  enumeration: DS.attr('group-edit-enum-test'),
  file: DS.attr('file'),
  master: DS.belongsTo('group-edit-test-detail-master', { inverse: null, async: false })
});

Model.defineProjection('GroupEditTestDetailE', 'group-edit-test-detail', {
  flag: Proj.attr('Flag'),
  text: Proj.attr('Text'),
  date: Proj.attr('Date'),
  enumeration: Proj.attr('Enumeration'),
  file: Proj.attr('File'),
  master: Proj.belongsTo('group-edit-test-detail-master', 'Master', {
    text: Proj.attr('Text', { hidden: true })
  }, {
    displayMemberPath: 'text'
  })
});

export default Model;
