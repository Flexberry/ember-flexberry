import EmberObject from '@ember/object';
import PaginatedControllerMixin from 'ember-flexberry/mixins/paginated-controller';
import { module, test } from 'qunit';

module('PaginatedControllerMixin');

test('it works', function(assert) {
  let PaginatedControllerObject = EmberObject.extend(PaginatedControllerMixin);
  let subject = PaginatedControllerObject.create();
  assert.ok(subject);
});
