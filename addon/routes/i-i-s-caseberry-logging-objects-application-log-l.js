/**
  @module ember-flexberry
 */

import ListFormRoute from 'ember-flexberry/routes/list-form';

/**
  Application log list form route.

  @class IISCaseberryLoggingObjectsApplicationLogLRoute
  @extends ListFormRoute
*/
export default ListFormRoute.extend({
  /**
    Model projection name.

    @property modelProjection
    @type String
    @default 'ApplicationLogL'
  */
  modelProjection: 'ApplicationLogL',

  /**
    Model name.

    @property modelName
    @type String
    @default 'i-i-s-caseberry-logging-objects-application-log'
  */
  modelName: 'i-i-s-caseberry-logging-objects-application-log',
});
