import DS from 'ember-data';
import BaseModel from './ember-flexberry-dummy-parent';
import { attr } from 'ember-flexberry-data/utils/attributes';
let Model = BaseModel.extend({
  phone1: DS.attr('string'),
  phone2: DS.attr('string'),
  phone3: DS.attr('string'),
});
Model.defineProjection('SuccessorE', 'ember-flexberry-dummy-successor-phone', {
  name: attr('Name'),
  phone1: attr('Phone1'),
  phone2: attr('Phone2'),
  phone3: attr('Phone3')
});
Model.defineProjection('SuccessorL', 'ember-flexberry-dummy-successor-phone', {
  name: attr('Name'),
  phone1: attr('Phone1'),
  phone2: attr('Phone2'),
  phone3: attr('Phone3')
});
export default Model;
