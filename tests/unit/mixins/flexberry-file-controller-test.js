import EmberObject from '@ember/object';
import FlexberryFileControllerMixin from 'ember-flexberry/mixins/flexberry-file-controller';
import { module, test } from 'qunit';

module('Unit | Mixin | flexberry file controller', function() {
  test('it works', function(assert) {
    let FlexberryFileControllerObject = EmberObject.extend(FlexberryFileControllerMixin);
    let subject = FlexberryFileControllerObject.create();
    assert.ok(subject);
  });
});
