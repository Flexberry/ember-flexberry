import Ember from 'ember';
import MultiListModelMixin from 'ember-flexberry/mixins/multi-list-model';
import { module, test } from 'qunit';

module('Unit | Mixin | multi list model');

test('it works', function(assert) {
  let MultiListModelObject = Ember.Object.extend(MultiListModelMixin);
  let subject = MultiListModelObject.create();
  assert.ok(subject);
});
