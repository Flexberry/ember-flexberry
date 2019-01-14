import DS from 'ember-data';
import BaseModel from './ember-flexberry-dummy-parent';
import { attr } from 'ember-flexberry-data/utils/attributes';
let Model = BaseModel.extend({
  vK: DS.attr('string'),
  facebook: DS.attr('string'),
  twitter: DS.attr('string'),
});
Model.defineProjection('SuccessorE', 'ember-flexberry-dummy-successor-social-network', {
  name: attr('Name'),
  vK: attr('VK'),
  facebook: attr('Facebook'),
  twitter: attr('Twitter')
});
Model.defineProjection('SuccessorL', 'ember-flexberry-dummy-successor-social-network', {
  name: attr('Name'),
  vK: attr('VK'),
  facebook: attr('Facebook'),
  twitter: attr('Twitter')
});
export default Model;
