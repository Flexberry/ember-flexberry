import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { run } from '@ember/runloop';

module('Unit | Model | new-platform-flexberry-flexberry-user-setting', function (hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let store = this.owner.lookup('service:store');
    let model = run(() => store.createRecord('new-platform-flexberry-flexberry-user-setting', {}));
    assert.ok(model);
  });
});
