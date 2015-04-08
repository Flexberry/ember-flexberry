import Ember from 'ember';
import SortableControllerMixin from '../../../mixins/sortable-controller';
import { module, test } from 'qunit';

module('SortableControllerMixin');

// Replace this with your real tests.
test('it works', function(assert) {
  var SortableControllerObject = Ember.Object.extend(SortableControllerMixin);
  var subject = SortableControllerObject.create();
  assert.ok(subject);
});
