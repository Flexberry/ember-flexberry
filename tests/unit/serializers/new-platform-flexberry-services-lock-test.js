import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { run } from '@ember/runloop';

module('Unit | Serializer | new-platform-flexberry-services-lock', function (hooks) {
  setupTest(hooks);

  test('it serializes records', function(assert) {
    let store = this.owner.lookup('service:store');
    let record = run(() => store.createRecord('new-platform-flexberry-services-lock', {}));
    let serializedRecord = record.serialize();

    assert.ok(serializedRecord);
  });
});
