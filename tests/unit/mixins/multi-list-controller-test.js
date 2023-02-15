import Ember from 'ember';
import MultiListControllerMixin from 'ember-flexberry/mixins/multi-list-controller';
import { module, test } from 'qunit';

module('Unit | Mixin | multi list controller');

test('it works', function(assert) {
  let MultiListControllerObject = Ember.Object.extend(MultiListControllerMixin);
  let subject = MultiListControllerObject.create();
  assert.ok(subject);
});
