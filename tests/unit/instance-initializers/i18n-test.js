import Ember from 'ember';
import I18nInstanceInitializer from 'ember-flexberry/instance-initializers/i18n';
import { module, test } from 'qunit';
import startApp from '../../helpers/start-app';
import destroyApp from '../../helpers/destroy-app';

let application;
let appInstance;

module('Unit | Instance Initializer | i18n', {
  beforeEach: function() {
    application = startApp();
    appInstance = application.buildInstance();
  },
  afterEach: function() {
    Ember.run(appInstance, 'destroy');
    destroyApp(appInstance);
  }
});

test('It works', function(assert) {
  assert.expect(1);
  I18nInstanceInitializer.initialize(appInstance);
  assert.ok(true);
});

test('Add true logic', function(assert) {
  assert.expect(2);
  assert.strictEqual(appInstance.__container__.factoryCache['service:i18n'], undefined);
  I18nInstanceInitializer.initialize(appInstance);
  assert.strictEqual(appInstance.__container__.factoryCache['service:i18n']._toString, 'dummy@service:i18n:');
});

test('Configures i18n service for locale', function(assert) {
  assert.expect(1);

  var controlValue = window.navigator.languages ? window.navigator.languages[0] : (window.navigator.language || window.navigator.userLanguage);
  I18nInstanceInitializer.initialize(appInstance);
  assert.strictEqual(appInstance.__container__.cache['service:i18n'].locale, controlValue);
});
