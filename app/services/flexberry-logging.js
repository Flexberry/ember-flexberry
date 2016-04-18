import Ember from 'ember';
const { getOwner } = Ember;

export default Ember.Service.extend({
// 	var flexberryStore=applicationInstance.lookup('service:store');
	applicationInstance:null,
	flexberryStore:null,	//current store
	serverLogEnabled:true,	//Remote logging service works correctly
	
	init() {
		this._super(...arguments);
// 		this.set('applicationInstance',getOwner(this));
// 		alert(this.get('applicationInstance'));
		this.set('flexberryStore', getOwner(this).lookup('service:store'));
// 		alert(this.get('flexberryStore'));
		this.set('serverLogEnabled', true);
	},
	
	flexberryLogger(levelName,message,formattedMessage) {
		window.console.log(message);
		if (this.get('serverLogEnabled')) {
			let timestamp= new Date();
			let browser=navigator.userAgent;
			let  applicationlog={
				'category':levelName,
				'eventId':0,
				'priority':10,
				'severity':'',
				'title':'',
				'timestamp':timestamp,
				'machineName': location.hostname,
				'appDomainName':browser,
				'processId':document.location.href,
				'processName':'EMBER-FLEXBERRY',
				'threadName':'',
				'win32ThreadId':'',
				'message':message,
				'formattedMessage':formattedMessage
			};
			let logModel='i-i-s-caseberry-logging-objects-application-log';
			if (this.get('flexberryStore').peekAll(logModel).findBy('message',message)!==undefined) {	//This message exists in the store?
// 				alert("RepeatedRecord="+message);
				return;	//return to avoid infinity loop when message is genetaried in save/ajax stage 
			}
// 			alert("SendMessage="+message);
			let logRecord=this.get('flexberryStore').createRecord(logModel,applicationlog);
			logRecord.save().then(
				function(contents) {
// 					alert("SendSuccessfull: "+contents);
				},
				function(contents){	//unsuccesfull transmit message to server 
					this.set('serverLogEnabled',false);	//switch off remote logging to avoid infinite loop
// 					alert("Sendfailed: "+contents);
				});
		}
		
	}
});
