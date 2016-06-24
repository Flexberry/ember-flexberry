/**
* @module ember-flexberry
*/
import Ember from 'ember';

/**
 * Initializator  for logging service
 */
export function initialize(applicationInstance) {

  /**
   *  flexberry-logging service for transmit error/warning/log/info/debug/deprecation messages to  store and save its on server as i-i-s-caseberry-logging-objects-application-log object
   *
   * @property flexberryLogging
   * @type Object Ember.Service
   * @default service:flexberry-logging
   */
  var flexberryLogging = applicationInstance.lookup('service:flexberry-logging');

  /**
  * LogLevel defined in configuration file config/environment.js
  * Possible values see in logLevelEnums
  *
  * @property flexberryLogLevel
  * @type integer
  * @default 0
  */
  var flexberryLogLevel = applicationInstance.resolveRegistration('config:environment').APP.flexberryLogLevel;

  if (flexberryLogLevel === undefined) {	//if not set
    flexberryLogLevel = 0;	//switch off Logging
  }

  flexberryLogging.flexberryLogLevel = flexberryLogLevel;
  if (flexberryLogLevel === 0) {
    return;	// Do nothing
  }

  /**
  * Replacement error handlers on RSVP stage
  * Do nothing. Error is handled by onerror
  */
  Ember.RSVP.on('error', function() {
  });

  /**
  * Replacement error handlers on error stage
  * Do nothing. Error is handled by onerror
  */
  Ember.Logger.error = function (error) {
    _sendError(error);
  };

  /**
  * Replacement error handler: send error message to server by flexberry-logging service
  * @param error - error object
  */
  Ember.onerror = function (error) {
    _sendError(error);
  };

  /**
  * Replacement warn handler: send warning message to server by flexberry-logging service
  * @param ...arguments
  */
  Ember.Logger.warn = function () {
    var message = _mergeArguments(...arguments);
    if (message.substr(0, 12) === 'DEPRECATION:') {	//deprecation send to log level DEPRECATION
      _sendLog('DEPRECATION', message, '');
    } else {
      _sendLog('WARN', message, '');
    }
  };

  /**
  * Replacement log handler: send warning message to server by flexberry-logging service
  * @param ...arguments
  */
  Ember.Logger.log = function () {
    _sendLog('LOG', _mergeArguments(...arguments), '');
  };

  /**
  * Replacement info handler: send warning message to server by flexberry-logging service
  * @param ...arguments
  */
  Ember.Logger.info = function () {
    _sendLog('INFO', _mergeArguments(...arguments), '');
  };

  /**
  * Replacement debug handler: send warning message to server by flexberry-logging service
  * @param ...arguments
  */
  Ember.Logger.debug = function () {
    _sendLog('DEBUG', _mergeArguments(...arguments), '');
  };

  /**
  * stringify all arguments
  * @param ...arguments
  * @return string representation of arguments
  */
  function _mergeArguments() {
    var ret = '';
    for (var i = 0; i < arguments.length; i++) {
      ret += arguments[i].toString();
    }

    return ret;
  }

  function _sendError(error) {
    var message = error.toString();
    var formattedMessage = JSON.stringify(
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
  * Send message to store and server by flexberry-logging service
  * @param levelName - category name  - ERROR, WARN, LOG, INFO, DEBUG, DEPRECATION
  * @param message - message content
  * @param formattedMessage - full message content in JSON format
  */
  function _sendLog(levelName, message, formattedMessage) {
    let logLevel = flexberryLogging.logLevelEnums[levelName];
    if (logLevel <= flexberryLogging.flexberryLogLevel) {	//Meggage category logged (lower or equal high flexberryLogLevel)
      flexberryLogging.flexberryLogger(logLevel, levelName, message, formattedMessage);
    }
  }

}

export default {
  name: 'flexberry-logging',
  initialize: initialize
};
