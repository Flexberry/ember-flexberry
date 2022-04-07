import Ember from 'ember';
import { module, test } from 'qunit';
import Errors from 'ember-validations/errors';

import EmberValidationsInitializer from 'dummy/initializers/ember-validations';

const { A, set } = Ember;

module('Unit | Initializer | ember-validations', {
  // eslint-disable-next-line qunit/no-setup-teardown
  setup() {
    EmberValidationsInitializer.initialize();
  },
});

test('it works', function(assert) {
  const errors = Errors.create();
  errors.on('errorListChanged', () => {
    assert.ok(true);
  });

  set(errors, 'error', A());
});
