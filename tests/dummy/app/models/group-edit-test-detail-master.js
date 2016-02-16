import DS from 'ember-data';
import BaseModel from 'ember-flexberry/models/base';
import Proj from 'ember-flexberry-projections';

var Model = BaseModel.extend({
  text: DS.attr('string')
});

Model.defineProjection('GroupEditTestDetailMasterE', 'group-edit-test-detail-master', {
  text: Proj.attr('Text')
});

export default Model;
