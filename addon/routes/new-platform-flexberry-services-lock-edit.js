/**
  @module ember-flexberry
*/

import EditFormRoute from './edit-form';

/**
  Route edit form for {{#crossLink "NewPlatformFlexberryServicesLockModel"}}{{/crossLink}}.

  @class NewPlatformFlexberryServicesLockEditRoute
  @extends EditFormRoute
*/
export default EditFormRoute.extend({
  /**
    @property modelName
    @type String
    @default 'new-platform-flexberry-services-lock'
  */
  modelName: 'new-platform-flexberry-services-lock',

  /**
    @property modelProjection
    @type String
    @default 'LockL'
  */
  modelProjection: 'LockL',
});
