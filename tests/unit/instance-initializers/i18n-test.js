import { run } from '@ember/runloop';
import { typeOf, isBlank } from '@ember/utils';
import I18nInstanceInitializer from 'ember-flexberry/instance-initializers/i18n';
import { module, test } from 'qunit';
import startApp from '../../helpers/start-app';
import destroyApp from '../../helpers/destroy-app';

let application;
let appInstance;
let fakeLocale;

module('Unit | Instance Initializer | i18n', {
  beforeEach() {
    application = startApp();
    appInstance = application.buildInstance();

    // Just take it and turn it off...
    appInstance.lookup('service:log').set('enabled', false);

    // Set 'fake-locale' as default i18n-service locale.
    let i18n = appInstance.lookup('service:i18n');
    fakeLocale = 'fake-locale';
    i18n.set('locale', fakeLocale);
  },

  afterEach() {
    destroyApp(appInstance);
    destroyApp(application);
  },
});

test('Configures i18n service for locale', function(assert) {
  run(() => {
    assert.expect(2);

    let i18n = appInstance.lookup('service:i18n');
    let ENV = appInstance.factoryFor('config:environment').class;
    let defaultLocale = (ENV.i18n || {}).defaultLocale;

    assert.strictEqual(i18n.get('locale'), fakeLocale, 'Default i18n-service locale is \'' + fakeLocale + '\'');

    let currentLocale = defaultLocale ? defaultLocale :
    window.navigator.languages ? window.navigator.languages[0] : (window.navigator.language || window.navigator.userLanguage);

    let locales = appInstance.lookup('controller:application').get('locales');
    if (!locales || typeOf(locales) !== 'array' || locales.indexOf(currentLocale) === -1 || isBlank(currentLocale)) {
      currentLocale = 'en';
    }

    I18nInstanceInitializer.initialize(appInstance);

    assert.strictEqual(i18n.get('locale'), currentLocale, 'Current i18n-service locale is \'' + currentLocale + '\'');
  });
});
