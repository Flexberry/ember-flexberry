import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | new-platform-flexberry-services-lock-list', function (hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:new-platform-flexberry-services-lock-list');
    assert.ok(route);
  });
});
