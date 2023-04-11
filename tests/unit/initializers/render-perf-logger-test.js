import { run } from '@ember/runloop';
import Application from '@ember/application';
import RenderPerfLoggerInitializer from 'dummy/initializers/render-perf-logger';
import { module, test } from 'qunit';

let application;

module('Unit | Initializer | render perf logger', function (hooks) {
  hooks.beforeEach(() => {
    run(function() {
      application = Application.create();
      application.deferReadiness();
    });
  });

  test('it works', function(assert) {
    RenderPerfLoggerInitializer.initialize(application);
  
    // you would normally confirm the results of the initializer here
    assert.ok(true);
  });  
});
