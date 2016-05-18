import DS from 'ember-data';
import BaseModel from 'ember-flexberry/models/base';
import Proj from 'ember-flexberry-data';

var Model = BaseModel.extend({
  contactName: DS.attr('string')
});

Model.defineProjection('CustomerE', 'customer', {
  contactName: Proj.attr('Contact Name')
});

Model.defineProjection('CustomerL', 'customer', {
  contactName: Proj.attr('Contact Name')
});

export default Model;
