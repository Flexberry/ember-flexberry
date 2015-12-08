import Ember from 'ember';
import PaginatedControllerMixin from 'ember-flexberry/mixins/paginated-controller';
import { module, test } from 'qunit';

module('PaginatedControllerMixin');

test('it works', function(assert) {
  var PaginatedControllerObject = Ember.Object.extend(PaginatedControllerMixin);
  var subject = PaginatedControllerObject.create();
  assert.ok(subject);
});
