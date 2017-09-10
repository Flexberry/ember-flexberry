import { moduleFor, test } from 'ember-qunit';

moduleFor('controller:detail-edit-form', 'Unit | Controller | detail edit form', {
  needs: [
    'controller:flexberry-file-view-dialog',
    'controller:lookup-dialog',
    'service:detail-interaction',
    'service:objectlistview-events',
    'service:user-settings',
  ],
});

// Replace this with your real tests.
test('it exists', function(assert) {
  let controller = this.subject();
  assert.ok(controller);
});
