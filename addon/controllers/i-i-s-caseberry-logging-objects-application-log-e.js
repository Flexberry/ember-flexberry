/**
  @module ember-flexberry
*/

import EditFormController from './edit-form';

/**
  Application log edit form controller.

  @class IISCaseberryLoggingObjectsApplicationLogEController
  @extends EditFormController
*/
export default EditFormController.extend({
  /**
    Flag: indicates whether edit form is in readonly mode or not.

    @property readonly
    @type Boolean
    @default true
  */
  readonly: true,

  /**
    Parent route name.

    @property parentRoute
    @type String
    @default 'i-i-s-caseberry-logging-objects-application-log-l'
  */
  parentRoute: 'i-i-s-caseberry-logging-objects-application-log-l'
});
