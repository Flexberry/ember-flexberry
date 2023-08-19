import { run } from '@ember/runloop';
import Application from '@ember/application';
import { initialize } from 'dummy/instance-initializers/lock';
import { module, test } from 'qunit';
import destroyApp from '../../helpers/destroy-app';

let application;
let appInstance;

module('Unit | Instance Initializer | lock', function (hooks) {
  hooks.beforeEach(() => {
    run(() => {
      application = Application.create();
      appInstance = application.buildInstance();
    });
  });

  hooks.afterEach(() => {
    run(appInstance, 'destroy');
    destroyApp(application);
  });

  test('it works', function(assert) {
    initialize(appInstance);
  
    // you would normally confirm the results of the initializer here
    assert.ok(true);
  });  
});
