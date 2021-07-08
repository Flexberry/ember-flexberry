import { moduleFor, test } from 'ember-qunit';

moduleFor('service:objectlistview-events', 'Unit | Service | objectlistview events', {
  // Specify the other units that are required for this test.
  needs: [
    'service:app-state',
  ],
});

// Replace this with your real tests.
test('it exists', function(assert) {
  var service = this.subject();
  assert.ok(service);
});
