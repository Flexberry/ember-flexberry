/**
  @module ember-flexberry
 */

import EditFormController from 'ember-flexberry/controllers/edit-form';

/**
  Controller for support edit form {{#crossLink "IISCaseberryLoggingObjectsApplicationLog"}}IISCaseberryLoggingObjectsApplicationLog{{/crossLink}} record.

  @class IISCaseberryLoggingObjectsApplicationLogEController
  @extends EditFormController
 */
export default EditFormController.extend({
  /**
    Title for edit form.

    @property title
    @type String
    @default 'Application log'
   */
  title: 'Application log',
});
