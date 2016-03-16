/**
 * @module ember-flexberry
 */

export function initialize() {
  // Support older and newer style initializer calls.
  const application = arguments[1] || arguments[0];
  [
    'component',
    'controller',
    'model',
    'route',
    'view'
  ].forEach(type => {
    application.inject(type, 'i18n', 'service:i18n');
  });
}

export default {
  name: 'i18n',
  after: 'ember-i18n',
  initialize
};
