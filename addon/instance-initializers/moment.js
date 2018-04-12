/**
  @module ember-flexberry
*/

import { addObserver } from '@ember/object/observers';

/**
  Configures a <a href="https://github.com/stefanpenner/ember-moment">moment service</a> for current application instance.
  Binds <a href="https://github.com/stefanpenner/ember-moment#globally-set-locale">moment's locale</a>
  to <a href="https://github.com/jamesarosen/ember-i18n/wiki/Doc:-Setting-the-Locale">i18n.locale</a> property.

  @for ApplicationInstanceInitializer
  @method moment.initialize
  @param {<a href="http://emberjs.com/api/classes/Ember.ApplicationInstance.html">Ember.ApplicationInstance</a>} applicationInstance Ember application instance.
*/
export function initialize(applicationInstance) {
  let i18n = applicationInstance.lookup('service:i18n');
  let moment = applicationInstance.lookup('service:moment');

  let changeMomentLocale = function() {
    let locale = i18n.get('locale');

    moment.changeLocale(locale);
    window.moment.updateLocale(locale);
  };

  let changeMomentDefaultFormat = function() {
    window.moment.defaultFormat = moment.get('defaultFormat');
  };

  // Initialize moment locale and change it every time i18n locale changes.
  changeMomentLocale();
  addObserver(i18n, 'locale', changeMomentLocale);

  // Initialize moment default format and change it every time default format changes.
  changeMomentDefaultFormat();
  addObserver(moment, 'defaultFormat', changeMomentDefaultFormat);
}

export default {
  after: 'i18n',
  name: 'moment',
  initialize
};
