import EmberObject from '@ember/object';
import ModalApplicationRouteMixin from 'ember-flexberry/mixins/modal-application-route';
import { module, test } from 'qunit';

module('ModalApplicationRouteMixin');

test('it works', function(assert) {
  let ModalApplicationRouteObject = EmberObject.extend(ModalApplicationRouteMixin);
  let subject = ModalApplicationRouteObject.create();
  assert.ok(subject);
});
