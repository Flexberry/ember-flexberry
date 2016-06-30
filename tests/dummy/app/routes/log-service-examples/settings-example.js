import ApllicationLogListFormRoute from 'ember-flexberry/routes/i-i-s-caseberry-logging-objects-application-log-l';

export default ApllicationLogListFormRoute.extend({
  /**
    Name of model projection to be used as record's properties limitation.

    @property modelProjection
    @type String
    @default 'ApplicationLogL'
  */
  modelProjection: 'ApplicationLogL',

  /**
    Name of model to be used as list's records types.

    @property modelName
    @type String
    @default 'i-i-s-caseberry-logging-objects-application-log'
  */
  modelName: 'i-i-s-caseberry-logging-objects-application-log'
});
