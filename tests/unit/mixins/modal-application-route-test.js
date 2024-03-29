import EmberObject from '@ember/object';
import ModalApplicationRouteMixin from 'ember-flexberry/mixins/modal-application-route';
import { module, test } from 'qunit';

module('Unit | Mixin | modal application route mixin', function() {
  test('it works', function(assert) {
    var ModalApplicationRouteObject = EmberObject.extend(ModalApplicationRouteMixin);
    var subject = ModalApplicationRouteObject.create();
    assert.ok(subject);
  });
});
