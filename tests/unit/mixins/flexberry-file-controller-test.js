import Ember from 'ember';
import FlexberryFileControllerMixin from 'ember-flexberry/mixins/flexberry-file-controller';
import { module, test } from 'qunit';

module('Unit | Mixin | flexberry file controller');

// Replace this with your real tests.
test('it works', function(assert) {
  let FlexberryFileControllerObject = Ember.Object.extend(FlexberryFileControllerMixin);
  let subject = FlexberryFileControllerObject.create();
  assert.ok(subject);
});
