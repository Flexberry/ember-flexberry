import { moduleFor, test } from 'ember-qunit';
import { run } from '@ember/runloop';

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
  let controller;
  run(() => {
    controller = this.subject();
  });

  assert.ok(controller);
});
