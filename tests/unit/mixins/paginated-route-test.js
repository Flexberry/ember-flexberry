import EmberObject from '@ember/object';
import PaginatedRouteMixin from 'ember-flexberry/mixins/paginated-route';
import { module, test } from 'qunit';

module('Unit | Mixin | paginated route mixin', function() {
  test('it works', function(assert) {
    var PaginatedRouteObject = EmberObject.extend(PaginatedRouteMixin);
    var subject = PaginatedRouteObject.create();
    assert.ok(subject);
  });
});
