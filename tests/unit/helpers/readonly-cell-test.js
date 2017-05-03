import Ember from 'ember';
import { readonlyCell } from 'dummy/helpers/readonly-cell';
import { module, test } from 'qunit';

let application;

module('Unit | Helper | readonly cell', {
  beforeEach() {
    Ember.run(function() {
      application = Ember.Application.create();
      application.deferReadiness();
    });
  }
});

test('it works', function(assert) {
  let result = readonlyCell([['test'], 'test', false]);
  assert.ok(result);
});
