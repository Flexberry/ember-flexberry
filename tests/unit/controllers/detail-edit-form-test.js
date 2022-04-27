import { moduleFor, test } from 'ember-qunit';
import { run } from '@ember/runloop';

moduleFor('controller:detail-edit-form', 'Unit | Controller | detail edit form', {
  needs: [
    'controller:advlimit-dialog',
    'controller:colsconfig-dialog',
    'controller:flexberry-file-view-dialog',
    'controller:lookup-dialog',
    'controller:filters-dialog',
    'controller:flexberry-menuitem-dialog',
    'service:detail-interaction',
    'service:objectlistview-events',
    'service:user-settings',
    'service:app-state',
    'service:adv-limit',
    'service:lookup-events',
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
