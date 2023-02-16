import Ember from 'ember';
import MultiListModelEditMixin from 'ember-flexberry/mixins/multi-list-model-edit';
import { module, test } from 'qunit';

module('Unit | Mixin | multi list model edit');

test('it works', function(assert) {
  let MultiListModelEditObject = Ember.Object.extend(MultiListModelEditMixin);
  let subject = MultiListModelEditObject.create();
  assert.ok(subject);
});
