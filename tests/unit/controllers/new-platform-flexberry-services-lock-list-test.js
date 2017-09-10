import { moduleFor, test } from 'ember-qunit';

moduleFor('controller:new-platform-flexberry-services-lock-list', 'Unit | Controller | new-platform-flexberry-services-lock-list', {
  needs: [
    'controller:colsconfig-dialog',
    'service:objectlistview-events',
    'service:user-settings',
  ],
});

test('it exists', function(assert) {
  let controller = this.subject();
  assert.ok(controller);
});
