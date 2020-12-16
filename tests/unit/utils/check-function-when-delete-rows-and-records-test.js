import Ember from 'ember';
import { checkConfirmDeleteRows, checkBeforeDeleteRecord } from 'ember-flexberry/utils/check-function-when-delete-rows-and-records';
import { module, test } from 'qunit';

module('Unit | Utility | check function when delete rows and records');

test('check confirm delete rows null', function(assert) {
  let result = checkConfirmDeleteRows();
  assert.ok(result);
  assert.ok(result instanceof Ember.RSVP.Promise);
});

test('check before delete rows null', function(assert) {
  let result = checkBeforeDeleteRecord();
  assert.ok(result);
  assert.ok(result instanceof Ember.RSVP.Promise);
});

test('check confirm delete rows arg is simple function', function(assert) {
  let funcTest = function() {
    return true;
  };

  let result = checkConfirmDeleteRows(funcTest);
  assert.ok(Ember.isNone(result));
});

test('check before delete rows arg is simple function and not cancel', function(assert) {
  let funcTest = function() {
    return true;
  };

  let data = {
    cancel: false
  };

  let result = checkBeforeDeleteRecord(funcTest, null, data);
  assert.ok(result);
  assert.ok(result instanceof Ember.RSVP.Promise);
});

test('check before delete rows arg is simple function and cancel', function(assert) {
  let funcTest = function() {
    return true;
  };

  let data = {
    cancel: true
  };

  let result = checkBeforeDeleteRecord(funcTest, null, data);
  assert.ok(Ember.isNone(result));
});