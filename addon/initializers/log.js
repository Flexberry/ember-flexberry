/**
  @module ember-flexberry
*/

/**
  Injects a {{#crossLink "LogService"}}log service{{/crossLink}} into current application
  components, controllers, models, routes, and views.

  @for ApplicationInitializer
  @method log.initialize
  @param {<a href="https://www.emberjs.com/api/ember/release/classes/Application">Application</a>} application Ember application.
*/
export function initialize(application) {
  [
    'component',
    'controller',
    'route',
    'view'
  ].forEach(type => {
    application.inject(type, 'logService', 'service:log');
  });
}

export default {
  name: 'log',
  initialize
};
