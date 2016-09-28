/**
  @module ember-flexberry
*/

import EditFormController from './edit-form';

/**
  Controller edit form for {{#crossLink "NewPlatformFlexberryServicesLockModel"}}{{/crossLink}}.

  @class NewPlatformFlexberryServicesLockEditController
  @extends EditFormController
*/
export default EditFormController.extend({
  /**
    @property readonly
    @type Boolean
    @default true
  */
  readonly: true,

  /**
    @property parentRoute
    @type String
    @default 'new-platform-flexberry-services-lock-list'
  */
  parentRoute: 'new-platform-flexberry-services-lock-list'
});
