import { moduleFor, test } from 'ember-qunit';

moduleFor('route:<%= entityName %>', 'Unit | Route | <%= entityName %>', {
  // Specify the other units that are required for this test.
  needs: [
    'service:cols-config-menu',
    'service:detail-interaction',
    'service:objectlistview-events',
    'service:user-settings',
  ],
});

test('it exists', function(assert) {
  let route = this.subject();
  assert.ok(route);
});
