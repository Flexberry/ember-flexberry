/**
  @module ember-flexberry
*/

import DS from 'ember-data';
import { Projection } from 'ember-flexberry-data';

/**
  Model of application log, message (used by {{#crossLink "LogService"}}log service{{/crossLink}}).

  @class IISCaseberryLoggingObjectsApplicationLogModel
  @extends BaseModel
*/
let Model = Projection.Model.extend({
  category: DS.attr('string'),
  eventId: DS.attr('number'),
  priority: DS.attr('number'),
  severity: DS.attr('string'),
  title: DS.attr('string'),
  timestamp: DS.attr('date'),
  machineName: DS.attr('string'),
  appDomainName: DS.attr('string'),
  processId: DS.attr('string'),
  processName: DS.attr('string'),
  threadName: DS.attr('string'),
  win32ThreadId: DS.attr('string'),
  message: DS.attr('string'),
  formattedMessage: DS.attr('string'),
  validations: {
  }
});

Model.defineProjection('ApplicationLogE', 'i-i-s-caseberry-logging-objects-application-log', {
  category: Projection.attr('Category'),
  eventId: Projection.attr('Event id'),
  priority: Projection.attr('Priority'),
  severity: Projection.attr('Severity'),
  title: Projection.attr('Title'),
  timestamp: Projection.attr('Timestamp'),
  machineName: Projection.attr('Machine name'),
  appDomainName: Projection.attr('App domain name'),
  processId: Projection.attr('Process id'),
  processName: Projection.attr('Process name'),
  threadName: Projection.attr('Thread name'),
  win32ThreadId: Projection.attr('Win32 thread id'),
  message: Projection.attr('Message'),
  formattedMessage: Projection.attr('Formatted message')
});

Model.defineProjection('ApplicationLogL', 'i-i-s-caseberry-logging-objects-application-log', {
  category: Projection.attr('Category'),
  eventId: Projection.attr('Event id'),
  priority: Projection.attr('Priority'),
  severity: Projection.attr('Severity'),
  title: Projection.attr('Title'),
  timestamp: Projection.attr('Timestamp'),
  machineName: Projection.attr('Machine name'),
  appDomainName: Projection.attr('App domain name'),
  processId: Projection.attr('Process id'),
  processName: Projection.attr('Process name'),
  threadName: Projection.attr('Thread name'),
  win32ThreadId: Projection.attr('Win32 thread id'),
  message: Projection.attr('Message'),
  formattedMessage: Projection.attr('Formatted message')
});

export default Model;
