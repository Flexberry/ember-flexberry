import Ember from 'ember';
import config from '../config/environment';

export function initialize( applicationInstance ) {
	var flexberryLogging= applicationInstance.lookup('service:flexberry-logging');
	var logLevelEnums={
		'ERROR':1,
		'WARN':2,
		'LOG':3,
		'INFO':4,
		'DEBUG':5,
		'DEPRECATION':6
	};	
	var flexberryLogLevel=config.APP.flexberryLogLevel;
	if (flexberryLogLevel===undefined) {
		flexberryLogLevel=1;
	}

	function _mergeArguments() {
		var ret='';
		for (var i=0;i<arguments.length;i++) {
			ret+=arguments[i].toString();
		}
		return ret;
	}
	
	function _sendLog(levelName,message,formattedMessage) {
		if (logLevelEnums[levelName] <=flexberryLogLevel) {	//Meggage category logged (lower or equal high flexberryLogLevel)
			flexberryLogging.flexberryLogger(levelName,message,formattedMessage);
		}
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
		_sendLog('ERROR',message,formattedMessage);
	};

	Ember.RSVP.on('error', function(/*error*/) {	//do nothing. Error is handled by onerror
// 		serverLogEnabled=false;	//switch off remote logging to avoid infinite loop
// 		alert('RSVP: '+ error);
	});

	Ember.Logger.error = function (message, cause, stack) {//do nothing. Error is handled by onerror
// 	alert('Logger:error: ' + new Error(message), null, { cause: cause, stack: stack });
	};
	
	Ember.Logger.warn= function () {
		var message=_mergeArguments(...arguments);
		if (message.substr(0,12)==='DEPRECATION:') {	//deprecation send to log level DEPRECATION
			_sendLog('DEPRECATION',message,'');
		} else {
			_sendLog('WARN',message,'');
		}
	};
	
	Ember.Logger.log= function () {
		_sendLog('LOG',_mergeArguments(...arguments),'');
	};	
	
	Ember.Logger.info= function () {
		_sendLog('INFO',_mergeArguments(...arguments),'');
	};	
	
	Ember.Logger.debug= function () {
		_sendLog('DEBUG',_mergeArguments(...arguments),'');
	};	
}

export default {
  name: 'flexberry-logging',
  initialize: initialize
};
