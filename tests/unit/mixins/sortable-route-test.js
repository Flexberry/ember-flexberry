import Ember from 'ember';
import SortableRouteMixin from 'ember-flexberry/mixins/sortable-route';
import { module, test } from 'qunit';

module('SortableRouteMixin');

test('it works', function(assert) {
  var SortableRouteObject = Ember.Object.extend(SortableRouteMixin);
  var subject = SortableRouteObject.create();
  assert.ok(subject);
});
