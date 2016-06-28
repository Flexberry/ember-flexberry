/**
  @module ember-flexberry
 */

import Ember from 'ember';

/**
  Service for logging message to applicationLog store.

  @class FlexberryLoggingService
  @extends <a href="http://emberjs.com/api/classes/Ember.Service.html">Ember.Service</a>
 */
export default Ember.Service.extend({
  /**
       Store for transmit messages to the server

       @property {Object} _flexberryStore
       @private
       @type DS.Store
   */
  _flexberryStore: Ember.inject.service('store'),
  /**
       Logger switcher on/off true if remote logging service works correctly

       @property {Boolean} _serverLogEnabled
       @private
       @type Boolean
       @default true
   */
  _serverLogEnabled: true,
  /**
       Current log level. Set this property to log appropriate interval of log types

       @property {Integer} flexberryLogLevel
       @type Integer
       @default 0
   */
  flexberryLogLevel: 0,

  /**
     Log level enumarator

     @property logLevelEnums
     @type Object
     @@default { ERROR: 1,WARN: 2, LOG: 3, INFO: 4, DEBUG: 5, DEPRECATION: 6 }
   */
  logLevelEnums: {

    // Log only errors.
    ERROR: 1,

    // Log warnings and errors.
    WARN: 2,

    // Log logs, warnings and errors.
    LOG: 3,

    // Log infos, logs, warnings and errors.
    INFO: 4,

    // Log debugs, infos, logs, warnings and errors.
    DEBUG: 5,

    // Log deprecations, debugs, infos, logs, warnings and errors.
    DEPRECATION: 6
  },
  /**
     Inverted to logLevelEnums array

     @property enumsLoglevel
     @type Array
     @default ['NONE','ERROR','WARN','LOG','INFO','DEBUG','DEPRECATION']
   */
  enumsLoglevel: ['NONE'],

  /**
    An overridable method called when objects are instantiated.
    [More info](http://emberjs.com/api/classes/Ember.Service.html#method_init).

    @method init
   */
  init() {
    this._super(...arguments);
    this.set('_serverLogEnabled', true);
    for (let enumName in this.logLevelEnums) {
      let level = this.logLevelEnums[enumName];
      this.enumsLoglevel[level] = enumName;
    }
  },

  /**
    Logger message to console and store

    @method flexberryLogger
    @param priority - priority
    @param levelName - category name  - ERROR, WARN, LOG, INFO, DEBUG, DEPRECATION
    @param message - message content
    @param formattedMessage - full message content in JSON format
  */
  flexberryLogger(priority, levelName, message, formattedMessage) {
    window.console.log(message);
    if (!this.get('_serverLogEnabled')) {
      return;
    }

    let timestamp = new Date();
    let browser = navigator.userAgent;
    let  applicationLog = {
      category: levelName,
      eventId: 0,
      priority: priority,
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
    let logModel = 'i-i-s-caseberry-logging-objects-application-log';
    if (this.get('_flexberryStore').peekAll(logModel).findBy('message', message) !== undefined) {
      return;	//return to avoid infinity loop when message is genetaried in save/ajax stage
    }

    //Construct record  in  store.
    let logRecord = this.get('_flexberryStore').createRecord(logModel, applicationLog);
    logRecord.save().then(
      function() {
        return true;
      },
      function() {

        // Unsuccesfull transmit message to the server - switch off remote logging to avoid infinite loop.
        this.set('serverLogEnabled', false);
      });
  },
});
