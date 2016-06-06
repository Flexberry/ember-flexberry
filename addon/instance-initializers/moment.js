/**
 * @module ember-flexberry
 */

import Ember from 'ember';

export function initialize(applicationInstance) {
  var i18n = applicationInstance.lookup('service:i18n');
  var moment = applicationInstance.lookup('service:moment');

  var changeMomentLocale = function() {
    var locale = i18n.get('locale');

    moment.changeLocale(locale);
    window.moment.locale(locale);
  };

  var changeMomentDefaultFormat = function() {
    window.moment.defaultFormat = moment.get('defaultFormat');
  };

  // Initialize moment locale and change it every time i18n locale changes.
  changeMomentLocale();
  Ember.addObserver(i18n, 'locale', changeMomentLocale);

  // Initialize moment default format and change it every time default format changes.
  changeMomentDefaultFormat();
  Ember.addObserver(moment, 'defaultFormat', changeMomentDefaultFormat);
}

export default {
  after: 'i18n',
  name: 'moment',
  initialize
};
