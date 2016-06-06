import DS from 'ember-data';
import BaseModel from 'ember-flexberry/models/base';
import Proj from 'ember-flexberry-data';

var Model = BaseModel.extend({
  flag: DS.attr('boolean'),
  date: DS.attr('date'),
  text: DS.attr('string')
});

// Edit form projection.
Model.defineProjection('MasterL', 'components-examples/flexberry-lookup/settings-example/master', {
  flag: Proj.attr('Flag'),
  date: Proj.attr('Date'),
  text: Proj.attr('Text')
});

export default Model;
