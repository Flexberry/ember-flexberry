import MomentInstanceInitializer from 'ember-flexberry/instance-initializers/moment';
import { module, test } from 'qunit';
import startApp from '../../helpers/start-app';
import destroyApp from '../../helpers/destroy-app';

let application;
let appInstance;
let defaultLocale;
let defaultFormat;

module('Unit | Instance Initializer | moment', function (hooks) {
  hooks.beforeEach(() => {
    application = startApp();
    appInstance = application.buildInstance();

    // Run instance-initializer.
    MomentInstanceInitializer.initialize(appInstance);

    // Set 'en' as default locale.
    let i18n = appInstance.lookup('service:i18n');
    defaultLocale = 'en';
    i18n.set('locale', defaultLocale);

    // Set 'DD.MM.YYYY' as default date format.
    let moment = appInstance.lookup('service:moment');
    defaultFormat = 'DD.MM.YYYY';
    moment.set('defaultFormat', defaultFormat);
  });

  hooks.afterEach(() => {
    destroyApp(appInstance);
    destroyApp(application);
  });

  test('Changes in i18n-service locale causes same changes in moment-service & in global moment object', function(assert) {
    assert.expect(4);
  
    let i18n = appInstance.lookup('service:i18n');
    let moment = appInstance.lookup('service:moment');
  
    assert.strictEqual(moment.get('locale'), defaultLocale, 'Initial locale in moment service is equals to \'' + defaultLocale + '\'');
    assert.strictEqual(window.moment.locale(), defaultLocale, 'Initial locale in window.moment object is equals to \'' + defaultLocale + '\'');
  
    let newLocale = 'ru';
    i18n.set('locale', newLocale);
  
    assert.strictEqual(moment.get('locale'), newLocale, 'Initial locale in moment service is equals to \'' + newLocale + '\'');
    assert.strictEqual(window.moment.locale(), newLocale, 'Initial locale in window.moment object is equals to \'' + newLocale + '\'');
  });
  
  test('Changes in moment-service default format causes same changes in global moment object', function(assert) {
    assert.expect(4);
  
    let moment = appInstance.lookup('service:moment');
  
    assert.strictEqual(moment.get('defaultFormat'), defaultFormat, 'Initial locale in moment service is equals to \'' + defaultFormat + '\'');
    assert.strictEqual(window.moment.defaultFormat, defaultFormat, 'Initial locale in window.moment object is equals to \'' + defaultFormat + '\'');
  
    let newDefaultFormat = 'MMMM Do YYYY, h:mm:ss a';
    moment.set('defaultFormat', newDefaultFormat);
  
    assert.strictEqual(moment.get('defaultFormat'), newDefaultFormat, 'Initial locale in moment service is equals to \'' + newDefaultFormat + '\'');
    assert.strictEqual(window.moment.defaultFormat, newDefaultFormat, 'Initial locale in window.moment object is equals to \'' + newDefaultFormat + '\'');
  });
});
