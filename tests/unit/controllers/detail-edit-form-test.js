import Ember from 'ember';
import { moduleFor, test } from 'ember-qunit';

moduleFor('controller:detail-edit-form', 'Unit | Controller | detail edit form', {
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']
});

// Replace this with your real tests.
test('it exists', function(assert) {
  let _this = this;

  Ember.run(function() {
    let controller = _this.subject();
    assert.ok(controller);
  });
});
