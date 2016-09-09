/**
  @module ember-flexberry
*/

import ListFormController from './list-form';

/**
  Controller list form for {{#crossLink "NewPlatformFlexberryServicesLockModel"}}{{/crossLink}}.

  @class NewPlatformFlexberryServicesLockListController
  @extends ListFormController
*/
export default ListFormController.extend({
  /**
    @property editFormRoute
    @type String
    @default 'new-platform-flexberry-services-lock-edit'
  */
  editFormRoute: 'new-platform-flexberry-services-lock-edit',
});
