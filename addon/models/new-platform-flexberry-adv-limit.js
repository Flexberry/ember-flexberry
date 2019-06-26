/**
  @module ember-flexberry
*/

import DS from 'ember-data';
import { Projection } from 'ember-flexberry-data';

let Model = Projection.Model.extend({
  user: DS.attr('string'),
  published: DS.attr('bool'),
  module: DS.attr('string'),
  name: DS.attr('string'),
  value: DS.attr('string'),
});

Model.defineProjection('AdvLimitL', 'new-platform-flexberry-adv-limit', {
  user: Projection.attr('string'),
  published: Projection.attr('bool'),
  module: Projection.attr('string'),
  name: Projection.attr('string'),
  value: Projection.attr('string'),
});
Model.defineIdType('string');

/**
  Model lock, use in {{#crossLink "LockRouteMixin"}}{{/crossLink}}.

  @class NewPlatformFlexberryServicesLockModel
  @extends BaseModel
*/
export default Model;
