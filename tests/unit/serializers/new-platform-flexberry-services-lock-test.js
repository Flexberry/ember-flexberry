import { moduleForModel, test } from 'ember-qunit';

moduleForModel('new-platform-flexberry-services-lock', 'Unit | Serializer | new-platform-flexberry-services-lock', {
  needs: ['serializer:new-platform-flexberry-services-lock']
});

// Replace this with your real tests.
test('it serializes records', function(assert) {
  let record = this.subject();
  let serializedRecord = record.serialize();
  assert.ok(serializedRecord);
});
