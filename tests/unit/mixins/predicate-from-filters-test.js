import Ember from 'ember';
import PredicateFromFiltersMixin from 'ember-flexberry/mixins/predicate-from-filters';
import { module, test } from 'qunit';

module('Unit | Mixin | predicate from filters');

// Replace this with your real tests.
test('it works', function(assert) {
  let PredicateFromFiltersObject = Ember.Object.extend(PredicateFromFiltersMixin);
  let subject = PredicateFromFiltersObject.create();
  assert.ok(subject);
});
