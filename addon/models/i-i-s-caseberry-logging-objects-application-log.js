/**
  @module ember-flexberry
*/

import DS from 'ember-data';
import BaseModel from 'ember-flexberry/models/base';
import Proj from 'ember-flexberry-data';

/**
  Model of application log, message (used by {{#crossLink "LogService"}}log service{{/crossLink}}).

  @class IISCaseberryLoggingObjectsApplicationLogModel
  @extends BaseModel
*/
let Model = BaseModel.extend({
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
  category: Proj.attr('Category'),
  eventId: Proj.attr('Event id'),
  priority: Proj.attr('Priority'),
  severity: Proj.attr('Severity'),
  title: Proj.attr('Title'),
  timestamp: Proj.attr('Timestamp'),
  machineName: Proj.attr('Machine name'),
  appDomainName: Proj.attr('App domain name'),
  processId: Proj.attr('Process id'),
  processName: Proj.attr('Process name'),
  threadName: Proj.attr('Thread name'),
  win32ThreadId: Proj.attr('Win32 thread id'),
  message: Proj.attr('Message'),
  formattedMessage: Proj.attr('Formatted message')
});

Model.defineProjection('ApplicationLogL', 'i-i-s-caseberry-logging-objects-application-log', {
  category: Proj.attr('Category'),
  eventId: Proj.attr('Event id'),
  priority: Proj.attr('Priority'),
  severity: Proj.attr('Severity'),
  title: Proj.attr('Title'),
  timestamp: Proj.attr('Timestamp'),
  machineName: Proj.attr('Machine name'),
  appDomainName: Proj.attr('App domain name'),
  processId: Proj.attr('Process id'),
  processName: Proj.attr('Process name'),
  threadName: Proj.attr('Thread name'),
  win32ThreadId: Proj.attr('Win32 thread id'),
  message: Proj.attr('Message'),
  formattedMessage: Proj.attr('Formatted message')
});

Model.defineProjection('ApplicationLogRusL', 'i-i-s-caseberry-logging-objects-application-log', {
  timestamp: Proj.attr('Время'),
  title: Proj.attr('Заголовок'),
  message: Proj.attr('Сообщение'),
  formattedMessage: Proj.attr('Форматированное сообщение'),
  category: Proj.attr('Категория'),
  eventId: Proj.attr('ID события'),
  priority: Proj.attr('Приоритет'),
  severity: Proj.attr('Серьёзность'),
  machineName: Proj.attr('Имя машины'),
  appDomainName: Proj.attr('Домен приложения'),
  processId: Proj.attr('ID процесса'),
  processName: Proj.attr('Имя процесса'),
  threadName: Proj.attr('Имя потока'),
  win32ThreadId: Proj.attr('ID потока Win32')
});

Model.defineProjection('ShortL', 'i-i-s-caseberry-logging-objects-application-log', {
  timestamp: Proj.attr('Время'),
  title: Proj.attr('Событие'),
  eventId: Proj.attr('Код события'),
  message: Proj.attr('Сообщение'),
  priority: Proj.attr('Приоритет'),
  category: Proj.attr('Категория'),
  severity: Proj.attr('Серьёзность'),
  machineName: Proj.attr('Имя машины'),
  processName: Proj.attr('Имя процесса')
});

export default Model;
