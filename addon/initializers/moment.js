/**
 * @module ember-flexberry
 */

export function initialize(application) {
  [
    'component',
    'controller',
    'model',
    'route',
    'view'
  ].forEach(type => {
    application.inject(type, 'moment', 'service:moment');
  });
}

export default {
  after: 'i18n',
  name: 'moment',
  initialize
};
