import Ember from 'ember';
import config from '../config/environment';
// import config from 'flexberry-ember-demo/config/environment';

export function initialize( applicationInstance ) {
	var logLevelEnums={
		'ERROR':1,
		'WARN':2,
		'LOG':3,
		'INFO':4,
		'DEBUG':5,
		'DEPRECATION':6
	};	
	var flexberryLogLevel=config.APP.flexberryLogLevel;
	if (flexberryLogLevel===undefined) flexberryLogLevel=1;
	var flexberryStore=applicationInstance.lookup('service:store');
	var serverLogEnabled=true;	//Remote logging service works correctly
	
	function flexberryLogger(levelName,message,formattedMessage) {
		window.console.log(message);
		var level=logLevelEnums[levelName];
		if (serverLogEnabled && level <=flexberryLogLevel) {
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
			if (flexberryStore.peekAll(logModel).findBy('message',message)!==undefined) {
				alert("RepeatedRecord="+message);
				return;
			}
			alert("SendMessage="+message);
			let logRecord=flexberryStore.createRecord(logModel,applicationlog);
			logRecord.save().then(
				function(contents) {
					alert("SendSuccessfull: "+contents);
				},
				function(contents){
					serverLogEnabled=false;	//switch off remote logging to avoid infinite loop
					alert("Sendfailed: "+contents);
				});
		}
		
	}

	function _mergeArguments() {
		var ret='';
		for (var i=0;i<arguments.length;i++) {
			ret+=arguments[i].toString();
		}
		return ret;
	}
	
	Ember.onerror = function (error) {
		var message=error.toString();
		var formattedMessage='{'+
				'"name":'+'"'+ error.name + '",'+
				'"message":'+'"'+ error.message + '",'+
				'"fileName":'+'"'+ error.fileName + '",'+
				'"lineNumber":'+'"'+ error.lineNumber + '",'+
				'"columnNumber":'+'"'+ error.columnNumber + '",'+
				'"stack":'+'"'+ error.stack + '"' +
			'}';
		flexberryLogger('ERROR',message,formattedMessage);
	};

	Ember.RSVP.on('error', function(error) {
		serverLogEnabled=false;	//switch off remote logging to avoid infinite loop
		alert('RSVP: '+ error);
	});

	Ember.Logger.error = function (message, cause, stack) {
	// If you want to send to Raygun in addition to console logging:
	alert('Logger:error: ' + new Error(message), null, { cause: cause, stack: stack });
	};
	
	Ember.Logger.warn= function () {
		var message=_mergeArguments(...arguments);
// 		alert('WARN='+message);
		if (message.substr(0,12)==='DEPRECATION:') {
			flexberryLogger('DEPRECATION',message,'');
		} else {
			flexberryLogger('WARN',message,'');
		}
	};
	
	Ember.Logger.log= function () {
		flexberryLogger('LOG',_mergeArguments(...arguments),'');
	};	
	
	Ember.Logger.info= function () {
		flexberryLogger('INFO',_mergeArguments(...arguments),'');
	};	
	
	Ember.Logger.debug= function () {
		flexberryLogger('DEBUG',_mergeArguments(...arguments),'');
	};	
}

export default {
  name: 'flexberry-logging',
  initialize: initialize
};
