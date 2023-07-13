import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Controller | new-platform-flexberry-services-lock-list', function (hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let controller = this.owner.lookup('controller:new-platform-flexberry-services-lock-list');
    assert.ok(controller);
  });
});
