import Ember from 'ember';
import { readonlyCell } from 'dummy/helpers/readonly-cell';
import { module, test } from 'qunit';

module('Unit | Helper | readonly cell');

test('it works', function(assert) {
  Ember.run(function() {
    let result = readonlyCell([['test'], 'test', false]);
    assert.ok(result);
  });
});
