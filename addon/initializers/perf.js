/**
  @module ember-flexberry
*/

/**
  Injects a {{#crossLink "PerfService"}}perf service{{/crossLink}} into current application
  components, controllers, models, routes, and views.
*/
export function initialize(application) {
  [
    'component',
    'controller',
    'route',
    'view'
  ].forEach(type => {
    application.inject(type, 'perfService', 'service:perf');
  });
}

export default {
  name: 'perf',
  initialize: initialize
};