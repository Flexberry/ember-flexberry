import DS from 'ember-data';
import BaseModel from 'ember-flexberry/models/base';
import Proj from 'ember-flexberry-data';

var Model = BaseModel.extend({
  text: DS.attr('string')
});

Model.defineProjection('TestMasterE', 'test-master', {
  text: Proj.attr('Text')
});

export default Model;
