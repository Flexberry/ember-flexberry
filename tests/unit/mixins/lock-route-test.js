import Route from '@ember/routing/route';
import RSVP from 'rsvp';
import { run } from '@ember/runloop';
import LockRouteMixin from 'ember-flexberry/mixins/lock-route';
import { module, test } from 'qunit';

module('Unit | Mixin | lock-route');

test('it works', function(assert) {
  assert.expect(3);
  let done = assert.async();
  let EditFormRoute = Route.extend(LockRouteMixin);
  let route = EditFormRoute.create();
  run(() => {
    assert.ok(route, 'Route created.');
    RSVP.all([
      route.openReadOnly().then((answer) => {
        assert.ok(answer, `Default 'openReadOnly' === 'true'.`);
      }),
      route.unlockObject().then((answer) => {
        assert.ok(answer, `Default 'unlockObject' === 'true'.`);
      }),
    ]).then(done);
  });
});
