import Ember from 'ember';
import SortableRouteMixin from '../../../mixins/sortable-route';
import { module, test } from 'qunit';

module('SortableRouteMixin');

// Replace this with your real tests.
test('it works', function(assert) {
  var SortableRouteObject = Ember.Object.extend(SortableRouteMixin);
  var subject = SortableRouteObject.create();
  assert.ok(subject);
});
