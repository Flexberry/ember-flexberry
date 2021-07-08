import { run } from '@ember/runloop';
import Application from '@ember/application';
import I18nInitializer from '../../../initializers/i18n';
import { module, test } from 'qunit';

let application;

module('Unit | Initializer | i18n', {
  beforeEach() {
    run(function() {
      application = Application.create();
      application.deferReadiness();
    });
  }
});

// Replace this with your real tests.
test('it works', function(assert) {
  I18nInitializer.initialize(application);

  // you would normally confirm the results of the initializer here
  assert.ok(true);
});
