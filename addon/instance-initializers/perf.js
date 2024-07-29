/**
  @module ember-flexberry
*/

/**
  Initializes {{#crossLink "PertService"}}perf service{{/crossLink}}
  to make it possible prehandle any application messages and store them into application perf.

  @for ApplicationInstanceInitializer
  @method perf.initialize
  @param {<a href="https://www.emberjs.com/api/ember/release/classes/ApplicationInstance">ApplicationInstance</a>} applicationInstance Ember application instance.
*/
export function initialize(applicationInstance) {
  // Instantiate perf service to force it's initialization logic execution.
  applicationInstance.lookup('service:perf');
}

export default {
  name: 'perf',
  initialize: initialize
};
