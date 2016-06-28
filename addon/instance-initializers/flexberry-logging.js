/**
  @module ember-flexberry
 */
import Ember from 'ember';

/**
  Override methods handlers of `Ember.Logger` for save message into application log.

  @method initialize
  @for FlexberryLoggingService
 */
export function initialize(applicationInstance) {

  /**
      flexberry-logging service for transmit error/warning/log/info/debug/deprecation messages to  store and save its on server as i-i-s-caseberry-logging-objects-application-log object

     @property flexberryLogging
     @type Object Ember.Service
     @default service:flexberry-logging
   */
  let flexberryLogging = applicationInstance.lookup('service:flexberry-logging');

  /**
    LogLevel defined in configuration file `config/environment.js`.
    Possible values see in `logLevelEnums`.

    @property flexberryLogLevel
    @type integer
    @default 0
   */
  let flexberryLogLevel = applicationInstance.resolveRegistration('config:environment').APP.flexberryLogLevel;

  if (flexberryLogLevel === undefined) {
    flexberryLogLevel = 0;
  }

  flexberryLogging.flexberryLogLevel = flexberryLogLevel;
  if (flexberryLogLevel === 0) {
    return;
  }

  /**
    Replacement error handlers on RSVP stage
    Do nothing. Error is handled by onerror
  */
  Ember.RSVP.on('error', function() {
  });

  /**
    Replacement error handlers on error stage
    Do nothing. Error is handled by onerror
  */
  Ember.Logger.error = function (error) {
    _sendError(error);
  };

  /**
    Replacement error handler: send error message to server by flexberry-logging service.
   */
  Ember.onerror = function (error) {
    _sendError(error);
  };

  /**
    Replacement warn handler: send warning message to server by flexberry-logging service.
   */
  Ember.Logger.warn = function () {
    let message = _mergeArguments(...arguments);
    if (message.substr(0, 12) === 'DEPRECATION:') {
      _sendLog('DEPRECATION', message, '');
    } else {
      _sendLog('WARN', message, '');
    }
  };

  /**
    Replacement log handler: send warning message to server by flexberry-logging service.
   */
  Ember.Logger.log = function () {
    _sendLog('LOG', _mergeArguments(...arguments), '');
  };

  /**
    Replacement info handler: send warning message to server by flexberry-logging service.
   */
  Ember.Logger.info = function () {
    _sendLog('INFO', _mergeArguments(...arguments), '');
  };

  /**
    Replacement debug handler: send warning message to server by flexberry-logging service.
   */
  Ember.Logger.debug = function () {
    _sendLog('DEBUG', _mergeArguments(...arguments), '');
  };

  /**
    Stringify all arguments.

    @method _mergeArguments
    @param ...arguments
    @return {String} String representation of arguments.
    @private
   */
  function _mergeArguments() {
    let ret = '';
    for (let i = 0; i < arguments.length; i++) {
      ret += arguments[i].toString();
    }

    return ret;
  }

  function _sendError(error) {
    let message = error.toString();
    let formattedMessage = JSON.stringify(
      {
        name: error.name,
        message: error.message,
        fileName: error.fileName,
        lineNumber: error.lineNumber,
        columnNumber: error.columnNumber,
        stack: error.stack
      }
    );
    _sendLog('ERROR', message, formattedMessage);
  }

  /**
    Send message to store and server by flexberry-logging service.

    @method _sendLog
    @param {String} levelName Category name - ERROR, WARN, LOG, INFO, DEBUG, DEPRECATION.
    @param {String} message Message content.
    @param {String} formattedMessage Full message content in JSON format.
    @private
   */
  function _sendLog(levelName, message, formattedMessage) {
    let logLevel = flexberryLogging.logLevelEnums[levelName];
    if (logLevel <= flexberryLogging.flexberryLogLevel) {
      flexberryLogging.flexberryLogger(logLevel, levelName, message, formattedMessage);
    }
  }

}

export default {
  name: 'flexberry-logging',
  initialize: initialize
};
