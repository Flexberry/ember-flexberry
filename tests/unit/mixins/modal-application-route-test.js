import Ember from 'ember';
import ModalApplicationRouteMixin from 'ember-flexberry/mixins/modal-application-route';
import { module, test } from 'qunit';

module('ModalApplicationRouteMixin');

test('it works', function(assert) {
  var ModalApplicationRouteObject = Ember.Object.extend(ModalApplicationRouteMixin);
  var subject = ModalApplicationRouteObject.create();
  assert.ok(subject);
});
