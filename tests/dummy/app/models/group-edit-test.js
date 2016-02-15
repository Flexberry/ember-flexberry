import DS from 'ember-data';
import BaseModel from 'ember-flexberry/models/base';
import Proj from 'ember-flexberry-projections';

var Model = BaseModel.extend({
  details: DS.hasMany('group-edit-test-detail', { inverse: null, async: false })
});

Model.defineProjection('GroupEditTestE', 'group-edit-test', {
  details: Proj.hasMany('group-edit-test-detail', 'Details', {
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
  })
});

export default Model;
