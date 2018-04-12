/**
  @module ember-flexberry
*/

import DS from 'ember-data';
import EmberFlexberryDataModel from 'ember-flexberry-data/models/model';
import { attr } from 'ember-flexberry-data/utils/attributes';

/**
  Model of application log, message (used by {{#crossLink "LogService"}}log service{{/crossLink}}).

  @class IISCaseberryLoggingObjectsApplicationLogModel
  @extends ember-flexberry-data/models/model
*/
let Model = EmberFlexberryDataModel.extend({
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
  category: attr('Category'),
  eventId: attr('Event id'),
  priority: attr('Priority'),
  severity: attr('Severity'),
  title: attr('Title'),
  timestamp: attr('Timestamp'),
  machineName: attr('Machine name'),
  appDomainName: attr('App domain name'),
  processId: attr('Process id'),
  processName: attr('Process name'),
  threadName: attr('Thread name'),
  win32ThreadId: attr('Win32 thread id'),
  message: attr('Message'),
  formattedMessage: attr('Formatted message')
});

Model.defineProjection('ApplicationLogL', 'i-i-s-caseberry-logging-objects-application-log', {
  category: attr('Category'),
  eventId: attr('Event id'),
  priority: attr('Priority'),
  severity: attr('Severity'),
  title: attr('Title'),
  timestamp: attr('Timestamp'),
  machineName: attr('Machine name'),
  appDomainName: attr('App domain name'),
  processId: attr('Process id'),
  processName: attr('Process name'),
  threadName: attr('Thread name'),
  win32ThreadId: attr('Win32 thread id'),
  message: attr('Message'),
  formattedMessage: attr('Formatted message')
});

export default Model;
