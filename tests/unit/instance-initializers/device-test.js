import Ember from 'ember';
import DeviceInstanceInitializer  from 'ember-flexberry/instance-initializers/device';
import { module, test } from 'qunit';
import startApp from '../../helpers/start-app';
import destroyApp from '../../helpers/destroy-app';

let application;
let appInstance;

module('Unit | Instance Initializer | Device', {
  beforeEach() {
    Ember.run(() => {
      application = startApp();
      appInstance = application.buildInstance();
    });
  },

  afterEach() {
    Ember.run(appInstance, 'destroy');
    destroyApp(appInstance);
  }
});

test('it works', function(assert) {
  assert.expect(1);
  DeviceInstanceInitializer.initialize(appInstance);
  assert.ok(true);
});

test('Add true logic', function(assert) {
  assert.expect(2);
  assert.strictEqual(appInstance.__container__.factoryCache['service:device'], undefined);
  DeviceInstanceInitializer.initialize(appInstance);
  assert.strictEqual(appInstance.__container__.factoryCache['service:device']._toString, 'dummy@service:device:');
});
