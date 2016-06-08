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
    LogLevel defined in configuration file `config/environment.js`.
    Possible values see in `logLevelEnums`.

    @property flexberryLogLevel
    @type integer
    @default 0
   */
  let flexberryLogLevel = applicationInstance.resolveRegistration('config:environment').APP.flexberryLogLevel;

  if (flexberryLogLevel === undefined) {	//if not set
    flexberryLogLevel = 0;	//switch off Logging
  }

  if (flexberryLogLevel === 0) {
    return;	// Do nothing
  }

  /**
    Service for transmit error/warning/log/info/debug/deprecation messages to
    store and save its on server as i-i-s-caseberry-logging-objects-application-log object.

    @property flexberryLogging
    @type FlexberryLoggingService
   */
  let flexberryLogging = applicationInstance.lookup('service:flexberry-logging');

  /**
    Log level enumarator.

    - **ERROR** - Log only errors.
    - **WARN** - Log warnings and errors.
    - **LOG** - Log logs, warnings and errors.
    - **INFO** - Log infos, logs, warnings and errors.
    - **DEBUG** - Log debugs, infos, logs, warnings and errors.
    - **DEPRECATION** - Log deprecations, debugs, infos, logs, warnings and errors.

    @property logLevelEnums
    @type Object
   */
  let logLevelEnums = {
    ERROR: 1,	// Log only errors
    WARN: 2,	// Log warnings and errors
    LOG: 3,	// Log logs, warnings and errors
    INFO: 4,	// Log infos, logs, warnings and errors
    DEBUG: 5,// Log debugs, infos, logs, warnings and errors
    DEPRECATION: 6 // Log deprecations, debugs, infos, logs, warnings and errors
  };

  /**
    Replacement error handlers on RSVP stage.
    Do nothing. Error is handled by onerror.
   */
  Ember.RSVP.on('error', function() {
  });

  /**
    Replacement error handlers on error stage.
    Do nothing. Error is handled by onerror.
   */
  Ember.Logger.error = function () {
  };

  /**
    Replacement error handler: send error message to server by flexberry-logging service.
   */
  Ember.onerror = function (error) {
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
  };

  /**
    Replacement warn handler: send warning message to server by flexberry-logging service.
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
    var ret = '';
    for (var i = 0; i < arguments.length; i++) {
      ret += arguments[i].toString();
    }

    return ret;
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
    if (logLevelEnums[levelName] <= flexberryLogLevel) {	//Meggage category logged (lower or equal high flexberryLogLevel)
      flexberryLogging.flexberryLogger(levelName, message, formattedMessage);
    }
  }

}

export default {
  name: 'flexberry-logging',
  initialize: initialize
};
