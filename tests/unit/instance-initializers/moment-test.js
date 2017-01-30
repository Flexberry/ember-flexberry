import Ember from 'ember';
import MomentInstanceInitializer from 'ember-flexberry/instance-initializers/moment';
import { module, test } from 'qunit';
import startApp from '../../helpers/start-app';
import destroyApp from '../../helpers/destroy-app';

let application;
let appInstance;

module('Unit | Instance Initializer | moment', {
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
  MomentInstanceInitializer.initialize(appInstance);
  assert.ok(true);
});

test('add true logic', function(assert) {
  assert.expect(2);
  MomentInstanceInitializer.initialize(appInstance);

  let i18n = appInstance.lookup('service:i18n');
  let moment = appInstance.lookup('service:moment');

  var localeObserver = i18n.hasObserverFor('locale');
  let defaultFormatObserver = moment.hasObserverFor('defaultFormat');

  assert.strictEqual(localeObserver, true);
  assert.strictEqual(defaultFormatObserver, true);
});

test('add service', function(assert) {
  assert.expect(2);
  MomentInstanceInitializer.initialize(appInstance);

  assert.strictEqual(appInstance.__container__.factoryCache['service:i18n']._toString, 'dummy@service:i18n:');
  assert.strictEqual(appInstance.__container__.factoryCache['service:moment']._toString, 'dummy@service:moment:');
});

test('change locale', function(assert) {
  assert.expect(2);
  MomentInstanceInitializer.initialize(appInstance);

  assert.strictEqual(window.moment._locale._abbr, 'en');

  let i18n = appInstance.lookup('service:i18n');
  i18n.set('locale', 'ru');

  assert.strictEqual(window.moment._locale._abbr, 'ru');
});
