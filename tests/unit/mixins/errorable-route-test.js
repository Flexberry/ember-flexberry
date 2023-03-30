import EmberObject from '@ember/object';
import ErrorableRouteMixin from 'ember-flexberry/mixins/errorable-route';
import { module, test } from 'qunit';

module('Unit | Mixin | errorable route', function() {
  test('it works', function(assert) {
    let ErrorableRouteObject = EmberObject.extend(ErrorableRouteMixin);
    let subject = ErrorableRouteObject.create();
    assert.ok(subject);
  });
});
