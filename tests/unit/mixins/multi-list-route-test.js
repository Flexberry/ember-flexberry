import EmberObject from '@ember/object';
import MultiListRouteMixin from 'ember-flexberry/mixins/multi-list-route';
import { module, test } from 'qunit';

module('Unit | Mixin | multi list route', function() {
  test('it works', function(assert) {
    let MultiListRouteObject = EmberObject.extend(MultiListRouteMixin);
    let subject = MultiListRouteObject.create();
    assert.ok(subject);
  });
});
