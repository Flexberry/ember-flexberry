/**
  @module ember-flexberry
*/

/**
  Injects a <a href="https://github.com/jamesarosen/ember-i18n">i18n service</a> into current application
  components, controllers, models, routes, and views.

  @for ApplicationInitializer
  @method i18n.initialize
  @param {<a href="https://www.emberjs.com/api/ember/release/classes/Application">Application</a>} application Ember application.
*/
export function initialize(application) {
  [
    'component',
    'controller',
    'model',
    'route',
    'view',
    'helper'
  ].forEach(type => {
    application.inject(type, 'i18n', 'service:i18n');
  });
}

export default {
  name: 'i18n',
  after: 'ember-i18n',
  initialize
};
