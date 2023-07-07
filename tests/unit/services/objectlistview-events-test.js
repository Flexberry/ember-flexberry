import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Service | objectlistview events', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let service = this.owner.lookup('service:objectlistview-events');
    assert.ok(service);
  });
});
