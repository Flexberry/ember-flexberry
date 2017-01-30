import Ember from 'ember';
import I18nInstanceInitializer from 'dummy/instance-initializers/i18n';
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

test('it works', function(assert) {
  assert.expect(1);
  I18nInstanceInitializer.initialize(appInstance);
  assert.ok(true);
});

test('add true logic', function(assert) {
  assert.expect(3);
  I18nInstanceInitializer.initialize(appInstance);
  assert.strictEqual(appInstance.__registry__._normalizeCache['service:i18n'], 'service:i18n');
  assert.strictEqual(appInstance.__registry__._normalizeCache['config:environment'], 'config:environment');
  assert.strictEqual(appInstance.__registry__._normalizeCache['service:moment'], 'service:moment');
});
