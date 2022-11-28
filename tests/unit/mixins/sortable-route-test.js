import EmberObject from '@ember/object';
import SortableRouteMixin from 'ember-flexberry/mixins/sortable-route';
import { module, test } from 'qunit';

module('SortableRouteMixin');

test('it works', function(assert) {
  let SortableRouteObject = EmberObject.extend(SortableRouteMixin);
  let subject = SortableRouteObject.create();
  assert.ok(subject);
});
