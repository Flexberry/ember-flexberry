/**
  @module ember-flexberry
*/

import DS from 'ember-data';
import { Projection } from 'ember-flexberry-data';

let Model = Projection.Model.extend({
  lockKey: DS.attr('string'),
  userName: DS.attr('string'),
  lockDate: DS.attr('date'),
});

Model.defineProjection('LockL', 'new-platform-flexberry-services-lock', {
  lockKey: Projection.attr('Lock key'),
  userName: Projection.attr('User name'),
  lockDate: Projection.attr('Lock date'),
});
Model.defineIdType('string');

/**
  Model lock, use in {{#crossLink "LockRouteMixin"}}{{/crossLink}}.

  @class NewPlatformFlexberryServicesLockModel
  @extends BaseModel
*/
export default Model;
