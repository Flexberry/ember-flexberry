import { test, moduleForModel } from 'ember-qunit';

moduleForModel('flexberry-user-setting', 'Unit | Model | flexberry-user-setting', {
  // Specify the other units that are required for this test.
  needs: []
});

test('it exists', function(assert) {
  var model = this.subject();
  assert.ok(!!model);
});
