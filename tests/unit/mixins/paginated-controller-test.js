import EmberObject from '@ember/object';
import PaginatedControllerMixin from 'ember-flexberry/mixins/paginated-controller';
import { module, test } from 'qunit';

module('PaginatedControllerMixin');

test('it works', function(assert) {
  var PaginatedControllerObject = EmberObject.extend(PaginatedControllerMixin);
  var subject = PaginatedControllerObject.create();
  assert.ok(subject);
});
