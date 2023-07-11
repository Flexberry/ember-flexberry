import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { run } from '@ember/runloop';

module('Unit | Serializer | <%= name %>', function (hooks) {
  setupTest(hooks);

  // Replace this with your real tests.
  test('it exists', function(assert) {
    let store = this.owner.lookup('service:store');
    let record = run(() => store.createRecord('<%= name %>', {}));
    let serializedRecord = record.serialize();

    assert.ok(serializedRecord);
  });
});
