import Ember from 'ember';
import ErrorableRouteMixin from 'ember-flexberry/mixins/errorable-route';
import { module, test } from 'qunit';

module('Unit | Mixin | errorable route');

// Replace this with your real tests.
test('it works', function(assert) {
  let ErrorableRouteObject = Ember.Object.extend(ErrorableRouteMixin);
  let subject = ErrorableRouteObject.create();
  assert.ok(subject);
});
