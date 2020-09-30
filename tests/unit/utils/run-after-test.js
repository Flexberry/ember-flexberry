import Ember from 'ember';
import { module, test } from 'qunit';

import runAfter from 'ember-flexberry/utils/run-after';

module('Unit | Utility | run-after');

test('possible condition', function(assert) {
  const done = assert.async();

  let counter = 0;
  const condition = () => ++counter === 5;

  runAfter(null, condition, () => {
    assert.strictEqual(counter, 5, `The 'condition' is called five times.`);
    done();
  });
});

test('impossible condition', function(assert) {
  const onerror = Ember.onerror;
  const done = assert.async();

  let error;
  let counter = 0;
  let conditionCalled = false;
  Ember.onerror = (e) => {
    error = e;
  };

  runAfter(null, () => {
    conditionCalled = true;
    throw new Error('Impossible condition.');
  }, () => ++counter);

  runAfter(null, () => conditionCalled, () => {
    Ember.onerror = onerror;

    assert.strictEqual(counter, 0, `The 'handler' is not called.`);
    assert.strictEqual(error.message, 'Impossible condition.', 'Condition complete.');

    done();
  });
});

test('validate context', function(assert) {
  const done = assert.async();

  const context = {};

  const condition = function() {
    assert.ok(this === context, `The 'condition' is called with correct context.`);
    return true;
  };

  const handler = function() {
    assert.ok(this === context, `The 'handler' is called with correct context.`);
    done();
  };

  runAfter(context, condition, handler);
});
