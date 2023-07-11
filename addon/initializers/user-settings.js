/**
  @module ember-flexberry
*/

/**
  Injects a <a href="UserSetingsService">user-setting service</a> into current application
  components, controllers, models, routes, and views.

  @for ApplicationInitializer
  @method userSettings.initialize
  @param {<a href="https://www.emberjs.com/api/ember/release/classes/Application">Application</a>} application Ember application.
*/
export function initialize(application) {
  [
    'component',
    'controller',
    'route',
    'view'
  ].forEach(type => {
    application.inject(type, 'userSettingsService', 'service:user-settings');
  });
}

export default {
  name: 'user-settings',
  initialize
};
