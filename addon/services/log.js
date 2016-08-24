/**
  @module ember-flexberry
*/

import Ember from 'ember';

const messageCategory = {
  error: { name: 'ERROR', priority: 1 },
  warn: { name: 'WARN', priority: 2 },
  log: { name: 'LOG', priority: 3 },
  info: { name: 'INFO', priority: 4 },
  debug: { name: 'DEBUG', priority: 5 },
  deprecate: { name: 'DEPRECATION', priority: 6 }
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

    @property storeWarnMessages
    @type Boolean
    @default false
    @example
    ```
    // Log service 'storeWarnMessages' setting could be also defined through application config/environment.js
    module.exports = function(environment) {
      var ENV = {
        ...
        APP: {
          ...
          log: {
            enabled: true,
            storeWarnMessages: true
          }
          ...
        }
        ...
    };
    ```
  */
  storeWarnMessages: false,

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
    let originalEmberLoggerError = Ember.Logger.error;
    let onError = function(error, rethrowError) {
      let message = error.message || error.toString();

      let formattedMessage = JSON.stringify(Ember.merge({
        name: null,
        message: null,
        fileName: null,
        lineNumber: null,
        columnNumber: null,
        stack: null
      }, error));
      return _this._storeToApplicationLog(messageCategory.error, message, formattedMessage);
    };

    // Assign Ember.onerror & Ember.RSVP.on('error', ...) handlers (see http://emberjs.com/api/#event_onerror).

    Ember.onerror = onError;
    Ember.RSVP.on('error', onError);

    // Extend Ember.Logger.log logic.
    Ember.Logger.error = function() {
      originalEmberLoggerError(...arguments);

      return onError(joinArguments(...arguments), false);
    };

    // Extend Ember.Logger.warn logic.
    let originalEmberLoggerWarn = Ember.Logger.warn;
    Ember.Logger.warn = function() {
      originalEmberLoggerWarn(...arguments);

      let message = joinArguments(...arguments);
      if (message.indexOf('DEPRECATION') === 0) {
        return _this._storeToApplicationLog(messageCategory.deprecate, message, '');
      } else {
        return _this._storeToApplicationLog(messageCategory.warn, message, '');
      }
    };

    // Extend Ember.Logger.log logic.
    let originalEmberLoggerLog = Ember.Logger.log;
    Ember.Logger.log = function() {
      originalEmberLoggerLog(...arguments);

      return _this._storeToApplicationLog(messageCategory.log, joinArguments(...arguments), '');
    };

    // Extend Ember.Logger.info logic.
    let originalEmberLoggerInfo = Ember.Logger.info;
    Ember.Logger.info = function() {
      originalEmberLoggerInfo(...arguments);

      return _this._storeToApplicationLog(messageCategory.info, joinArguments(...arguments), '');
    };

    // Extend Ember.Logger.debug logic.
    let originalEmberLoggerDebug = Ember.Logger.debug;
    Ember.Logger.debug = function() {
      originalEmberLoggerDebug(...arguments);

      return _this._storeToApplicationLog(messageCategory.debug, joinArguments(...arguments), '');
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
      category.name === messageCategory.error.name && !this.get('storeErrorMessages') ||
      category.name === messageCategory.warn.name && !this.get('storeWarnMessages') ||
      category.name === messageCategory.log.name && !this.get('storeLogMessages') ||
      category.name === messageCategory.info.name && !this.get('storeInfoMessages') ||
      category.name === messageCategory.debug.name && !this.get('storeDebugMessages') ||
      category.name === messageCategory.deprecate.name && !this.get('storeDeprecationMessages')) {
      return;
    }

    let applicationLogProperties = {
      category: category.name,
      eventId: 0,
      priority: category.priority,
      severity: '',
      title: '',
      timestamp: new Date(),
      machineName:  location.hostname,
      appDomainName: navigator.userAgent,
      processId: document.location.href,
      processName: 'EMBER-FLEXBERRY',
      threadName: '',
      win32ThreadId: '',
      message: message,
      formattedMessage: formattedMessage
    };

    let applicationLogModelName = 'i-i-s-caseberry-logging-objects-application-log';
    let store = this.get('store');

    // Break if message already exists in store (to avoid infinit loop when message is generated while saving itself).
    if (store.peekAll(applicationLogModelName).findBy('message', message) !== undefined) {
      return;
    }

    return store.createRecord(applicationLogModelName, applicationLogProperties).save().
      then(
        result => {return result;},

        // Switch off remote logging on rejection to avoid infinite loop.
        reason => {this.set('enabled', false);}
      );
  },
});
