import EmberObject from '@ember/object';
import SortableRouteMixin from 'ember-flexberry/mixins/sortable-route';
import { module, test } from 'qunit';

module('SortableRouteMixin');

test('it works', function(assert) {
  var SortableRouteObject = EmberObject.extend(SortableRouteMixin);
  var subject = SortableRouteObject.create();
  assert.ok(subject);
});
