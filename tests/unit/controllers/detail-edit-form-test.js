import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { run } from '@ember/runloop';

module('Unit | Controller | detail edit form', function (hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let controller;
    run(() => {
      controller = this.owner.lookup('controller:detail-edit-form');
    });
  
    assert.ok(controller);
  });
});
