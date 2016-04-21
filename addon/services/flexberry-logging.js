import Ember from 'ember';
const { getOwner } = Ember;

export default Ember.Service.extend({
  /**
  * store for transmit messages to server
  */
  flexberryStore:null,
  /*
  *  true if remote logging service works correctly
  */
  serverLogEnabled:true,	//Remote logging service works correctly

  /**
  * Initializator (set flexberryStore)
  */
  init() {
    this._super(...arguments);
    this.set('flexberryStore', getOwner(this).lookup('service:store'));//alert(this.get('flexberryStore'));
    this.set('serverLogEnabled', true);
  },

  /**
  * Logger message to console, store and server
  * if serverLogEnabled ===false logs only to console
  * @param levelName - category name  - ERROR, WARN, LOG, INFO, DEBUG, DEPRECATION
  * @param message - message content
  * @param formattedMessage - full message content in JSON format
  */
  flexberryLogger(levelName, message, formattedMessage) {
    window.console.log(message);
    if (!this.get('serverLogEnabled')) { // if serverLogEnabled ===false logs only to console
      return;
    }

    let timestamp = new Date();	//current date
    let browser = navigator.userAgent;	//browser info
    let  applicationLog = {
      category:levelName,
      eventId:0,
      priority:10,
      severity:'',
      title:'',
      timestamp:timestamp,
      machineName: location.hostname,
      appDomainName:browser,
      processId:document.location.href,
      processName:'EMBER-FLEXBERRY',
      threadName:'',
      win32ThreadId:'',
      message:message,
      formattedMessage:formattedMessage
    };
    let logModel = 'i-i-s-caseberry-logging-objects-application-log';	//Model for applicationLog
    if (this.get('flexberryStore').peekAll(logModel).findBy('message', message) !== undefined) {	//This message exists in the store?
      //alert("RepeatedRecord="+message);
      return;	//return to avoid infinity loop when message is genetaried in save/ajax stage
    }

    //alert("SendMessage ="+message);
    let logRecord = this.get('flexberryStore').createRecord(logModel, applicationLog);	//Construct record  in  store
    logRecord.save().then(//Save recotd in server
      function(/*contents*/) {	//Successfull
        //alert("SendSuccessfull: "+contents);
      },
      function(/*contents*/) {	//unsuccesfull transmit message to server
        this.set('serverLogEnabled', false);	//switch off remote logging to avoid infinite loop
        //alert("Sendfailed: "+contents);
      });
  }

});
