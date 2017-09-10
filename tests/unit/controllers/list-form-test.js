import { moduleFor, test } from 'ember-qunit';

moduleFor('controller:list-form', 'Unit | Controller | list form', {
  needs: [
    'controller:colsconfig-dialog',
    'service:objectlistview-events',
    'service:user-settings',
  ],
});

// Replace this with your real tests.
test('it exists', function(assert) {
  let controller = this.subject();
  assert.ok(controller);
});
