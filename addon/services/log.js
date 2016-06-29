/**
  @module ember-flexberry
*/

import Ember from 'ember';

const messageCategory = {
  error: 'ERROR',
  warn: 'WARN',
  log: 'LOG',
  info: 'INFO',
  debug: 'DEBUG',
  deprecation: 'DEPRECATION',
};

const joinArguments = function() {
  let result = '';
  for (let i = 0, len = arguments.length; i < len; i++) {
    result += arguments[i].toString();
    if (i < len) {
      result += ' ';
    }
  }

  return result;
};

/**
  Log service (stores client-side logs, warns, errors, ... into application log).

  @class LogService
  @extends <a href="http://emberjs.com/api/classes/Ember.Service.html">Ember.Service</a>
*/
export default Ember.Service.extend({
  /**
    Ember data store.

    @property store
    @type <a href="http://emberjs.com/api/data/classes/DS.Store.html">DS.Store</a>
  */
  store: Ember.inject.service('store'),

  /**
    Flag: indicates whether log service is enabled or not (if not, nothing will be stored to application log).

    @property enabled
    @type Boolean
    @default false
    @example
    ```
    // LogServise 'enabled' setting could be also defined through application config/environment.js
    module.exports = function(environment) {
      var ENV = {
        ...
        APP: {
          ...
          log: {
            enabled: true
          }
          ...
        }
        ...
    };
    ```
  */
  enabled: false,

  /**
    Flag: indicates whether log service will store error messages to application log or not.

    @property storeErrorMessages
    @type Boolean
    @default true
    @example
    ```
    // Log service 'storeErrorMessages' setting could be also defined through application config/environment.js
    module.exports = function(environment) {
      var ENV = {
        ...
        APP: {
          ...
          log: {
            enabled: true,
            storeErrorMessages: false
          }
          ...
        }
        ...
    };
    ```
  */
  storeErrorMessages: true,

  /**
    Flag: indicates whether log service will store 'WARN' messages to application log or not.

    @property storeWarningMessages
    @type Boolean
    @default false
    @example
    ```
    // Log service 'storeWarningMessages' setting could be also defined through application config/environment.js
    module.exports = function(environment) {
      var ENV = {
        ...
        APP: {
          ...
          log: {
            enabled: true,
            storeWarningMessages: true
          }
          ...
        }
        ...
    };
    ```
  */
  storeWarningMessages: false,

  /**
    Flag: indicates whether log service will store 'LOG' messages to application log or not.

    @property storeLogMessages
    @type Boolean
    @default false
    @example
    ```
    // Log service 'storeLogMessages' setting could be also defined through application config/environment.js
    module.exports = function(environment) {
      var ENV = {
        ...
        APP: {
          ...
          log: {
            enabled: true,
            storeLogMessages: true
          }
          ...
        }
        ...
    };
    ```
  */
  storeLogMessages: false,

  /**
    Flag: indicates whether log service will store 'INFO' messages to application log or not.

    @property storeInfoMessages
    @type Boolean
    @default false
    @example
    ```
    // Log service 'storeInfoMessages' setting could be also defined through application config/environment.js
    module.exports = function(environment) {
      var ENV = {
        ...
        APP: {
          ...
          log: {
            enabled: true,
            storeInfoMessages: true
          }
          ...
        }
        ...
    };
    ```
  */
  storeInfoMessages: false,

  /**
    Flag: indicates whether log service will store 'DEBUG' messages to application log or not.

    @property storeDebugMessages
    @type Boolean
    @default false
    @example
    ```
    // Log service 'storeDeprecationMessages' setting could be also defined through application config/environment.js
    module.exports = function(environment) {
      var ENV = {
        ...
        APP: {
          ...
          log: {
            enabled: true,
            storeDebugMessages: true
          }
          ...
        }
        ...
    };
    ```
  */
  storeDebugMessages: false,

  /**
    Flag: indicates whether log service will store 'DEPRECATION' messages to application log or not.

    @property storeDeprecationMessages
    @type Boolean
    @default false
    @example
    ```
    // Log service 'storeDeprecationMessages' setting could be also defined through application config/environment.js
    module.exports = function(environment) {
      var ENV = {
        ...
        APP: {
          ...
          log: {
            enabled: true,
            storeDeprecationMessages: true
          }
          ...
        }
        ...
    };
    ```
  */
  storeDeprecationMessages: false,

  /**
    Initializes log service.
    Ember services are singletons, so this code will be executed only once since application initialization.
  */
  init() {
    this._super(...arguments);

    let _this = this;
    let onError = function(error) {
      let message = error.toString();
      let formattedMessage = JSON.stringify({
        name: error.name,
        message: error.message,
        fileName: error.fileName,
        lineNumber: error.lineNumber,
        columnNumber: error.columnNumber,
        stack: error.stack
      });

      _this._storeToApplicationLog(messageCategory.error, message, formattedMessage);
    };

    // Assign Ember.onerror & Ember.RSVP.on('error', ...) handlers (see http://emberjs.com/api/#event_onerror).
    Ember.onerror = onError;
    Ember.RSVP.on('error', onError);

    // Extend Ember.Logger.log logic.
    let originalEmberLoggerError = Ember.Logger.error;
    Ember.Logger.error = function() {
      originalEmberLoggerError(...arguments);

      Ember.onerror(joinArguments(...arguments));
    };

    // Extend Ember.Logger.warn logic.
    let originalEmberLoggerWarn = Ember.Logger.warn;
    Ember.Logger.warn = function() {
      originalEmberLoggerWarn(...arguments);

      let message = joinArguments(...arguments);
      if (message.indexOf('DEPRECATION') === 0) {
        _this._storeToApplicationLog(messageCategory.deprecation, message, '');
      } else {
        _this._storeToApplicationLog(messageCategory.war, message, '');
      }
    };

    // Extend Ember.Logger.log logic.
    let originalEmberLoggerLog = Ember.Logger.log;
    Ember.Logger.log = function() {
      originalEmberLoggerLog(...arguments);

      _this._storeToApplicationLog(messageCategory.log, joinArguments(...arguments), '');
    };

    // Extend Ember.Logger.info logic.
    let originalEmberLoggerInfo = Ember.Logger.info;
    Ember.Logger.info = function() {
      originalEmberLoggerInfo(...arguments);

      _this._storeToApplicationLog(messageCategory.info, joinArguments(...arguments), '');
    };

    // Extend Ember.Logger.debug logic.
    let originalEmberLoggerDebug = Ember.Logger.debug;
    Ember.Logger.debug = function() {
      originalEmberLoggerDebug(...arguments);

      _this._storeToApplicationLog(messageCategory.debug, joinArguments(...arguments), '');
    };
  },

  /**
    Stores given message to application log.

    @method _storeToApplicationLog
    @param {String} category Message category: 'ERROR', 'WARN', 'LOG', 'INFO', 'DEBUG', 'DEPRECATION'.
    @param {String} message Message itself.
    @param {String} formattedMessage Full message content in JSON format.
    @private
  */
  _storeToApplicationLog(category, message, formattedMessage) {
    if (!this.get('enabled') ||
      category === messageCategory.error && !this.get('storeErrorMessages') ||
      category === messageCategory.warn && !this.get('storeWarningMessages') ||
      category === messageCategory.log && !this.get('storeLogMessages') ||
      category === messageCategory.info && !this.get('storeInfoMessages') ||
      category === messageCategory.debug && !this.get('storeDebugMessages') ||
      category === messageCategory.deprecation && !this.get('storeDeprecationMessages')) {
      return;
    }

    let timestamp = new Date();
    let browser = navigator.userAgent;
    let logMessageProperties = {
      category: category,
      eventId: 0,
      priority: 10,
      severity: '',
      title: '',
      timestamp: timestamp,
      machineName:  location.hostname,
      appDomainName: browser,
      processId: document.location.href,
      processName: 'EMBER-FLEXBERRY',
      threadName: '',
      win32ThreadId: '',
      message: message,
      formattedMessage: formattedMessage
    };

    let logMessageModelName = 'i-i-s-caseberry-logging-objects-application-log';
    let store = this.get('store');

    // Break if message already exists in store (to avoid infinity loop when message is generated while saving itself).
    if (store.peekAll(logMessageModelName).findBy('message', message) !== undefined) {
      return;
    }

    store.createRecord(logMessageModelName, logMessageProperties).save().catch(() => {
      // Switch off remote logging on rejection to avoid infinite loop.
      this.set('enabled', false);
    });
  },
});
