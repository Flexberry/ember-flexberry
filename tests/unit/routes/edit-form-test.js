import { moduleFor, test } from 'ember-qunit';

moduleFor('route:edit-form', 'Unit | Route | edit form', {
  needs: [
    'service:cols-config-menu',
    'service:detail-interaction',
    'service:objectlistview-events',
    'service:user-settings',
    'service:app-state',
  ],
});

test('it exists', function(assert) {
  let route = this.subject();
  assert.ok(route);
});
