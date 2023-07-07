import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Service | form load time tracker', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let service = this.owner.lookup('service:form-load-time-tracker');
    assert.ok(service);
  });
});
