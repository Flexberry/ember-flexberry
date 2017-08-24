import DS from 'ember-data';
import BaseModel from './ember-flexberry-dummy-parent';
import { Projection } from 'ember-flexberry-data';
let Model = BaseModel.extend({
  vK: DS.attr('string'),
  facebook: DS.attr('string'),
  twitter: DS.attr('string'),
  validations: {

  }
});
Model.defineProjection('SuccessorE', 'ember-flexberry-dummy-successor-social-network', {
  name: Projection.attr('Name'),
  vK: Projection.attr('VK'),
  facebook: Projection.attr('Facebook'),
  twitter: Projection.attr('Twitter')
});
Model.defineProjection('SuccessorL', 'ember-flexberry-dummy-successor-social-network', {
  name: Projection.attr('Name'),
  vK: Projection.attr('VK'),
  facebook: Projection.attr('Facebook'),
  twitter: Projection.attr('Twitter')
});
export default Model;
