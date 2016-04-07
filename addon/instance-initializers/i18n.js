/**
 * @module ember-flexberry
 */

export function initialize(applicationInstance) {
  // Set i18n locale.
  var i18n = applicationInstance.lookup('service:i18n');
  var locale = navigator.language || navigator.userLanguage || i18n.locale;

  i18n.set('locale', locale);
}

export default {
  name: 'i18n',
  initialize
};
