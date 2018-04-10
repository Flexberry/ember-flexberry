/**
  @module ember-flexberry
*/

import Ember from 'ember'; //TODO Import Module. Replace Ember.Logger, Ember.onerror.
import Service, { inject as service } from '@ember/service';
import Evented from '@ember/object/evented';
import { getOwner } from '@ember/application';
import RSVP from 'rsvp';
import { typeOf, isNone } from '@ember/utils';
import { A, isArray } from '@ember/array';
import { assert } from '@ember/debug';
import { set } from '@ember/object';

const messageCategory = {
  error: { name: 'ERROR', priority: 1 },
  warn: { name: 'WARN', priority: 2 },
  log: { name: 'LOG', priority: 3 },
  info: { name: 'INFO', priority: 4 },
  debug: { name: 'DEBUG', priority: 5 },
  deprecate: { name: 'DEPRECATION', priority: 6 },
  promise: { name: 'PROMISE', priority: 7 }
};

const joinArguments = function() {
  let result = '';
  for (let i = 0, len = arguments.length; i < len; i++) {
    if (arguments[i] && arguments[i].toString) {
      result += arguments[i].toString();
    }

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
export default Service.extend(Evented, {
  /**
    Cache containing references to original Logger methods.
    Cache is needed to restore original methods on service destroy.

    @property _originalMethodsCache
    @type Object[]
    @default null
    @private
  */
  _originalMethodsCache: null,

  /**
    Ember data store.

    @property store
    @type <a href="http://emberjs.com/api/data/classes/DS.Store.html">DS.Store</a>
  */
  store: service('store'),

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
    Flag: indicates whether log service will store promise errors to application log or not.

    @property storePromiseErrors
    @type Boolean
    @default false
    @example
    ```
    // Log service 'storePromiseErrors' setting could be also defined through application config/environment.js
    module.exports = function(environment) {
      var ENV = {
        ...
        APP: {
          ...
          log: {
            enabled: true,
            storePromiseErrors: true
          }
          ...
        }
        ...
    };
    ```
  */
  storePromiseErrors: false,

  /**
    Flag: indicates whether log service will display promise errors in console.

    @property showPromiseErrors
    @type Boolean
    @default false
    @example
    ```
    // Log service 'showPromiseErrors' setting could be also defined through application config/environment.js
    module.exports = function(environment) {
      var ENV = {
        ...
        APP: {
          ...
          log: {
            enabled: true,
            showPromiseErrors: true
          }
          ...
        }
        ...
    };
    ```
  */
  showPromiseErrors: false,

  /**
    Initializes log service.
    Ember services are singletons, so this code will be executed only once since application initialization.
  */
  init() {
    this._super(...arguments);

    let _this = this;
    let originalMethodsCache = A();

    let originalEmberLoggerError = Ember.Logger.error;
    originalMethodsCache.pushObject({
      methodOwner: Ember.Logger,
      methodName: 'error',
      methodReference: originalEmberLoggerError
    });

    let onError = function(error) {
      // If `this` is not undefined then assuming this function was called as promise error handler. So we not performing it.
      if (!this || error instanceof Error) {
        originalEmberLoggerError(error);
        _this._onError(error, false);
      }
    };

    let onPromiseError = function(reason) {
      if (_this.get('showPromiseErrors')) {
        originalEmberLoggerError(reason);
      }

      _this._onError(reason, true);
    };

    // Assign Ember.onerror & Ember.RSVP.on('error', ...) handlers (see http://emberjs.com/api/#event_onerror).
    Ember.onerror = onError;
    RSVP.on('error', onPromiseError);

    // Extend Ember.Logger.error logic.
    Ember.Logger.error = function() {
      originalEmberLoggerError(...arguments);

      _this._storeToApplicationLog(messageCategory.error, joinArguments(...arguments), '');
    };

    // Extend Ember.Logger.warn logic.
    let originalEmberLoggerWarn = Ember.Logger.warn;
    originalMethodsCache.pushObject({
      methodOwner: Ember.Logger,
      methodName: 'warn',
      methodReference: originalEmberLoggerWarn
    });

    Ember.Logger.warn = function() {
      originalEmberLoggerWarn(...arguments);

      let message = joinArguments(...arguments);
      if (message.indexOf('DEPRECATION') === 0) {
        _this._storeToApplicationLog(messageCategory.deprecate, message, '');
      } else {
        _this._storeToApplicationLog(messageCategory.warn, message, '');
      }
    };

    // Extend Ember.Logger.log logic.
    let originalEmberLoggerLog = Ember.Logger.log;
    originalMethodsCache.pushObject({
      methodOwner: Ember.Logger,
      methodName: 'log',
      methodReference: originalEmberLoggerLog
    });

    Ember.Logger.log = function() {
      originalEmberLoggerLog(...arguments);

      _this._storeToApplicationLog(messageCategory.log, joinArguments(...arguments), '');
    };

    // Extend Ember.Logger.info logic.
    let originalEmberLoggerInfo = Ember.Logger.info;
    originalMethodsCache.pushObject({
      methodOwner: Ember.Logger,
      methodName: 'info',
      methodReference: originalEmberLoggerInfo
    });

    Ember.Logger.info = function() {
      originalEmberLoggerInfo(...arguments);

      _this._storeToApplicationLog(messageCategory.info, joinArguments(...arguments), '');
    };

    // Extend Ember.Logger.debug logic.
    let originalEmberLoggerDebug = Ember.Logger.debug;
    originalMethodsCache.pushObject({
      methodOwner: Ember.Logger,
      methodName: 'debug',
      methodReference: originalEmberLoggerDebug
    });

    Ember.Logger.debug = function() {
      originalEmberLoggerDebug(...arguments);

      _this._storeToApplicationLog(messageCategory.debug, joinArguments(...arguments), '');
    };

    this.set('_originalMethodsCache', originalMethodsCache);
  },

  /**
    Destroys log service.
  */
  willDestroy() {
    this._super(...arguments);

    // Restore original Ember.Logger methods.
    let originalMethodsCache = this.get('_originalMethodsCache');
    if (isArray(originalMethodsCache)) {
      originalMethodsCache.forEach((cacheEntry) => {
        set(cacheEntry.methodOwner, cacheEntry.methodName, cacheEntry.methodReference);
      });
    }

    // Cleanup Ember.onerror & Ember.RSVP.on('error', ...) handlers (see http://emberjs.com/api/#event_onerror).
    Ember.onerror = null;
    RSVP.off('error');
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
      category.name === messageCategory.deprecate.name && !this.get('storeDeprecationMessages') ||
      category.name === messageCategory.promise.name && !this.get('storePromiseErrors')) {
      return new RSVP.Promise((resolve) => {
        this._triggerEvent(category.name);
        resolve();
      });
    }

    let appConfig = getOwner(this).factoryFor('config:environment').class;
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
      threadName: appConfig.modulePrefix,
      win32ThreadId: '',
      message: message,
      formattedMessage: formattedMessage
    };

    let applicationLogModelName = 'i-i-s-caseberry-logging-objects-application-log';
    let store = this.get('store');

    // Break if message already exists in store (to avoid infinit loop when message is generated while saving itself).
    let applicationLogModel = store.peekAll(applicationLogModelName).findBy('message', message);
    if (applicationLogModel !== undefined) {
      /* eslint-disable no-unused-vars */
      return new RSVP.Promise((resolve, reject) => {
        this._triggerEvent(category.name, applicationLogModel);
        resolve();
      });
      /* eslint-enable no-unused-vars */
    }

    /* eslint-disable no-unused-vars */
    return store.createRecord(applicationLogModelName, applicationLogProperties).save().then((applicationLogModel) => {
      this._triggerEvent(category.name, applicationLogModel);
      return applicationLogModel;
    }).catch((reason) => {
      // Switch off remote logging on rejection to avoid infinite loop.
      this.set('enabled', false);
    });
    /* eslint-enable no-unused-vars */
  },

  _triggerEvent(eventName, applicationLogModel) {
    assert('Logger Error: event name should be a string', typeOf(eventName) === 'string');
    let eventNameToTrigger = eventName.toLowerCase();
    this.trigger(eventNameToTrigger, applicationLogModel);
  },

  _onError(error, isPromiseError) {
    if (isNone(error)) {
      return;
    }

    if (typeOf(error) === 'string') {
      error = new Error(error);
    }

    let message = error.message || error.toString();

    let formattedMessageBlank = {
      name: error && error.name ? error.name : null,
      message: error && error.message ? error.message : null,
      fileName: error && error.fileName ? error.fileName : null,
      lineNumber: error && error.lineNumber ? error.lineNumber : null,
      columnNumber: error && error.columnNumber ? error.columnNumber : null,
      stack: error && error.stack ? error.stack : null
    };

    let formattedMessage = JSON.stringify(formattedMessageBlank);

    this._storeToApplicationLog(isPromiseError ? messageCategory.promise : messageCategory.error, message, formattedMessage);
  }
});
