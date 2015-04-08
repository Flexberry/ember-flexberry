import Ember from 'ember';
import PaginatedControllerMixin from '../../../mixins/paginated-controller';
import { module, test } from 'qunit';

module('PaginatedControllerMixin');

// Replace this with your real tests.
test('it works', function(assert) {
  var PaginatedControllerObject = Ember.Object.extend(PaginatedControllerMixin);
  var subject = PaginatedControllerObject.create();
  assert.ok(subject);
});
