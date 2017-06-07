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
    destroyApp(appInstance);
    destroyApp(application);
  }
});

test('Inject device service into application resolver', function(assert) {
  assert.expect(2);

  let applicationResolver = appInstance.application.__registry__.resolver;
  let deviceService = appInstance.lookup('service:device');

  assert.notStrictEqual(applicationResolver.get('device'), deviceService);
  DeviceInstanceInitializer.initialize(appInstance);
  assert.strictEqual(applicationResolver.get('device'), deviceService);
});
