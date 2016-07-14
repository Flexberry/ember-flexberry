/**
  @module ember-flexberry
*/

import EditFormRoute from 'ember-flexberry/routes/edit-form';

/**
  Application log edit form route.

  @class IISCaseberryLoggingObjectsApplicationLogERoute
  @extends EditFormRoute
*/
export default EditFormRoute.extend({
  /**
    Model projection name.

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
