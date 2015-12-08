import Ember from 'ember';
import SortableControllerMixin from 'ember-flexberry/mixins/sortable-controller';
import { module, test } from 'qunit';

module('SortableControllerMixin');

test('it works', function(assert) {
  var SortableControllerObject = Ember.Object.extend(SortableControllerMixin);
  var subject = SortableControllerObject.create();
  assert.ok(subject);
});
