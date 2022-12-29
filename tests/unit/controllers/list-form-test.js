import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Controller | list form', function (hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let controller = this.owner.lookup('controller:list-form');
    assert.ok(controller);
  });
});
