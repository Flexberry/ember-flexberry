/**
  @module ember-flexberry
*/

import DS from 'ember-data';
import EmberFlexberryDataModel from 'ember-flexberry-data/models/model';
import { attr } from 'ember-flexberry-data/utils/attributes';

let Model = EmberFlexberryDataModel.extend({
  lockKey: DS.attr('string'),
  userName: DS.attr('string'),
  lockDate: DS.attr('date'),
});

Model.defineProjection('LockL', 'new-platform-flexberry-services-lock', {
  lockKey: attr('Lock key'),
  userName: attr('User name'),
  lockDate: attr('Lock date'),
});

/**
  Model lock, use in {{#crossLink "LockRouteMixin"}}{{/crossLink}}.

  @class NewPlatformFlexberryServicesLockModel
  @extends BaseModel
*/
export default Model;
