import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Service | detail interaction', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    var service = this.owner.lookup('service:detail-interaction');
    assert.ok(service);
  });
});
