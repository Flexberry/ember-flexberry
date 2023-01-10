import EmberObject from '@ember/object';
import SortableRouteMixin from 'ember-flexberry/mixins/sortable-route';
import { module, test } from 'qunit';

module('Unit | Mixin | sortable route mixin', function() {
  test('it works', function(assert) {
    var SortableRouteObject = EmberObject.extend(SortableRouteMixin);
    var subject = SortableRouteObject.create();
    assert.ok(subject);
  });
});
