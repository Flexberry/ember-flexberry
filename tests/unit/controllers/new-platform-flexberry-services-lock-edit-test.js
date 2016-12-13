import Ember from 'ember';
import { moduleFor, test } from 'ember-qunit';

moduleFor('controller:new-platform-flexberry-services-lock-edit', 'Unit | Controller | new-platform-flexberry-services-lock-edit');

test('it exists', function(assert) {
  let _this = this;

  Ember.run(function() {
    let controller = _this.subject();
    assert.ok(controller);
  });
});
