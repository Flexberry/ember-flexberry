import DS from 'ember-data';
import BaseModel from './ember-flexberry-dummy-parent';
import { Projection } from 'ember-flexberry-data';
let Model = BaseModel.extend({
  phone1: DS.attr('string'),
  phone2: DS.attr('string'),
  phone3: DS.attr('string'),
  validations: {

  }
});
Model.defineProjection('SuccessorE', 'ember-flexberry-dummy-successor-phone', {
  name: Projection.attr('Name'),
  phone1: Projection.attr('Phone1'),
  phone2: Projection.attr('Phone2'),
  phone3: Projection.attr('Phone3')
});
Model.defineProjection('SuccessorL', 'ember-flexberry-dummy-successor-phone', {
  name: Projection.attr('Name'),
  phone1: Projection.attr('Phone1'),
  phone2: Projection.attr('Phone2'),
  phone3: Projection.attr('Phone3')
});
export default Model;
