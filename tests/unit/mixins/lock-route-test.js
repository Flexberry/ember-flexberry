import Ember from 'ember';
import LockRouteMixin from 'ember-flexberry/mixins/lock-route';
import { module, test } from 'qunit';

module('Unit | Mixin | lock-route');

test('it works', function(assert) {
  assert.expect(3);
  let done = assert.async();
  let EditFormRoute = Ember.Route.extend(LockRouteMixin);
  let route = EditFormRoute.create();
  Ember.run(() => {
    assert.ok(route, 'Route created.');
    Ember.RSVP.all([
      route.openReadOnly().then((answer) => {
        assert.ok(answer, `Default 'openReadOnly' === 'true'.`);
      }),
      route.unlockObject().then((answer) => {
        assert.ok(answer, `Default 'unlockObject' === 'true'.`);
      }),
    ]).then(done);
  });
});
