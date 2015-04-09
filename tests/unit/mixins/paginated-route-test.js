import Ember from 'ember';
import PaginatedRouteMixin from '../../../mixins/paginated-route';
import { module, test } from 'qunit';

module('PaginatedRouteMixin');

// Replace this with your real tests.
test('it works', function(assert) {
  var PaginatedRouteObject = Ember.Object.extend(PaginatedRouteMixin);
  var subject = PaginatedRouteObject.create();
  assert.ok(subject);
});
