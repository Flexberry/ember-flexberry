import DS from 'ember-data';
// import BaseModel from 'ember-flexberry/models/base';

// var Model = BaseModel.extend({
var Model = DS.Model.extend({
	'category': DS.attr('string'),
	'eventId': DS.attr('number'),
	'priority': DS.attr('number'),
	'severity': DS.attr('string'),
	'title': DS.attr('string'),
	'timestamp':DS.attr('date'),
	'machineName':  DS.attr('string'),
	'appDomainName': DS.attr('string'),
	'processId': DS.attr('string'),
	'processName': DS.attr('string'),
	'threadName': DS.attr('string'),
	'win32ThreadId': DS.attr('string'),
	'message': DS.attr('string'),
	'formattedMessage': DS.attr('string'),
});

export default Model;
