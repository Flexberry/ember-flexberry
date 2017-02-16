import I18nInstanceInitializer from 'ember-flexberry/instance-initializers/i18n';
import { module, test } from 'qunit';
import startApp from '../../helpers/start-app';
import destroyApp from '../../helpers/destroy-app';

let application;
let appInstance;
let fakeLocale;

module('Unit | Instance Initializer | i18n', {
  beforeEach: function() {
    application = startApp();
    appInstance = application.buildInstance();

    // Set 'fake-locale' as default i18n-service locale.
    let i18n = appInstance.lookup('service:i18n');
    fakeLocale = 'fake-locale';
    i18n.set('locale', fakeLocale);
  },
  afterEach: function() {
    destroyApp(appInstance);
    destroyApp(application);
  }
});

test('Configures i18n service for locale', function(assert) {
  assert.expect(2);

  let i18n = appInstance.lookup('service:i18n');
  assert.strictEqual(i18n.get('locale'), fakeLocale, 'Default i18n-service locale is \'' + fakeLocale + '\'');

  var browserCurrentLocale = window.navigator.languages ? window.navigator.languages[0] : (window.navigator.language || window.navigator.userLanguage);
  I18nInstanceInitializer.initialize(appInstance);

  assert.strictEqual(i18n.get('locale'), browserCurrentLocale, 'Current i18n-service locale is \'' + browserCurrentLocale + '\'');
});
