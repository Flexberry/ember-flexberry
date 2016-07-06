import Ember from 'ember';
import FlexberryGroupeditRouteMixin from 'ember-flexberry/mixins/flexberry-groupedit-route';
import { module, test } from 'qunit';

module('Unit | Mixin | flexberry groupedit route');

// Replace this with your real tests.
test('it works', function(assert) {
  let FlexberryGroupeditRouteObject = Ember.Object.extend(FlexberryGroupeditRouteMixin);
  let subject = FlexberryGroupeditRouteObject.create();
  assert.ok(subject);
});
