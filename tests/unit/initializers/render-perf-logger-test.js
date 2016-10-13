import Ember from 'ember';
import RenderPerfLoggerInitializer from 'dummy/initializers/render-perf-logger';
import { module, test } from 'qunit';

let application;

module('Unit | Initializer | render perf logger', {
  beforeEach() {
    Ember.run(function() {
      application = Ember.Application.create();
      application.deferReadiness();
    });
  }
});

// Replace this with your real tests.
test('it works', function(assert) {
  RenderPerfLoggerInitializer.initialize(application);

  // you would normally confirm the results of the initializer here
  assert.ok(true);
});
