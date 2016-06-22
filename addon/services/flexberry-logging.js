/**
 * @module ember-flexberry
 */
import Ember from 'ember';
const { getOwner } = Ember;

/**
 * Service for logging message to applicationLog store
 *
 * @class LoggingService
 * @extends Ember.Service
 * @public
 */
export default Ember.Service.extend({
  /**
   store for transmit messages to server

   @property {Object} flexberryStore
   */
  flexberryStore: null,
  /**
   Logger switcher on/off true if remote logging service works correctly

   @property {Boolean} serverLogEnabled
   */
  serverLogEnabled: true,	//Remote logging service works correctly

  flexberryLogLevel: 0,

  /**
   * Log level enumarator
   *
   * @property logLevelEnums
   * @type Object
   */
  logLevelEnums: {
    ERROR: 1, // Log only errors
    WARN: 2,  // Log warnings and errors
    LOG: 3, // Log logs, warnings and errors
    INFO: 4,  // Log infos, logs, warnings and errors
    DEBUG: 5,// Log debugs, infos, logs, warnings and errors
    DEPRECATION: 6 // Log deprecations, debugs, infos, logs, warnings and errors
  },

  enumsLoglevel: ['NONE'],
  /**
  * Initializator
  *
  * @method init
  */
  init() {
    this._super(...arguments);
    this.set('flexberryStore', getOwner(this).lookup('service:store'));
    this.set('serverLogEnabled', true);
    for (let enumName in this.logLevelEnums) {
      let level = this.logLevelEnums[enumName];
      this.enumsLoglevel[level] = enumName;
    }
  },

  /**
  * Logger message to console and store
  *
  * @method flexberryLogger
  * @param priority - priority
  * @param levelName - category name  - ERROR, WARN, LOG, INFO, DEBUG, DEPRECATION
  * @param message - message content
  * @param formattedMessage - full message content in JSON format
  */
  flexberryLogger(priority, levelName, message, formattedMessage) {
    window.console.log(message);
    if (!this.get('serverLogEnabled')) { // if serverLogEnabled === false logs only to console
      return;
    }

    let timestamp = new Date();	//current date
    let browser = navigator.userAgent;	//browser info
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
    let logModel = 'i-i-s-caseberry-logging-objects-application-log';	//Model for applicationLog
    if (this.get('flexberryStore').peekAll(logModel).findBy('message', message) !== undefined) {	//This message exists in the store?
      return;	//return to avoid infinity loop when message is genetaried in save/ajax stage
    }

    let logRecord = this.get('flexberryStore').createRecord(logModel, applicationLog);	//Construct record  in  store
    logRecord.save().then(//Save recotd in server
      function() {	//Successfull
        return true;
      },
      function() {	//unsuccesfull transmit message to server
        this.set('serverLogEnabled', false);	//switch off remote logging to avoid infinite loop
      });
  }

});
