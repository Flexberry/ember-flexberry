/**
  @module ember-flexberry
 */

import EditFormRoute from 'ember-flexberry/routes/edit-form';

/**
  Route for support edit form {{#crossLink "IISCaseberryLoggingObjectsApplicationLog"}}IISCaseberryLoggingObjectsApplicationLog{{/crossLink}} record.

  @class IISCaseberryLoggingObjectsApplicationLogERoute
  @extends EditFormRoute
 */
export default EditFormRoute.extend({
  /**
    Projection name.

    @property modelProjection
    @type String
    @default 'ApplicationLogE'
   */
  modelProjection: 'ApplicationLogE',

  /**
    Model name.

    @property modelName
    @type String
    @default 'i-i-s-caseberry-logging-objects-application-log'
   */
  modelName: 'i-i-s-caseberry-logging-objects-application-log',
});
