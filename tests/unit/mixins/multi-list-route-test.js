import Ember from 'ember';
import MultiListRouteMixin from 'ember-flexberry/mixins/multi-list-route';
import { module, test } from 'qunit';

module('Unit | Mixin | multi list route');

test('it works', function(assert) {
  let MultiListRouteObject = Ember.Object.extend(MultiListRouteMixin);
  let subject = MultiListRouteObject.create();
  assert.ok(subject);
});
