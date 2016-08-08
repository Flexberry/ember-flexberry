/**
  @module ember-flexberry
*/

import Ember from 'ember';

/**
  Configures a <a href="https://github.com/jamesarosen/ember-i18n">i18n service</a> for current application instance.
  Sets browser's current locale to <a href="https://github.com/jamesarosen/ember-i18n/wiki/Doc:-Setting-the-Locale">i18n.locale</a> property.

  @for ApplicationInstanceInitializer
  @method i18n.initialize
  @param {<a href="http://emberjs.com/api/classes/Ember.ApplicationInstance.html">Ember.ApplicationInstance</a>} applicationInstance Ember application instance.
*/
export function initialize(applicationInstance) {
  let i18n = applicationInstance.lookup('service:i18n');
  if (Ember.isNone(i18n)) {
    return;
  }

  // See https://alicoding.com/detect-browser-language-preference-in-firefox-and-chrome-using-javascript
  let browserCurrentLocale = navigator.languages ? navigator.languages[0] : (navigator.language || navigator.userLanguage);
  if (!Ember.isBlank(browserCurrentLocale)) {
    i18n.set('locale', browserCurrentLocale);
  }
}

export default {
  name: 'i18n',
  initialize
};
