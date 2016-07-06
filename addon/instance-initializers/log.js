/**
  @module ember-flexberry
*/

/**
  Initializes {{#crossLink "LogService"}}log service{{/crossLink}}
  to make it possible prehandle any application messages and store them into application log.

  @for ApplicationInstanceInitializer
  @method log.initialize
  @param {<a href="http://emberjs.com/api/classes/Ember.ApplicationInstance.html">Ember.ApplicationInstance</a>} applicationInstance Ember application instance.
*/
export function initialize(applicationInstance) {
  // Instantiate log service to force it's initialization logic execution.
  applicationInstance.lookup('service:log');
}

export default {
  name: 'log',
  initialize: initialize
};
