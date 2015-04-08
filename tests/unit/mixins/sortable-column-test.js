import Ember from 'ember';
import SortableColumnMixin from '../../../mixins/sortable-column';
import { module, test } from 'qunit';

module('SortableColumnMixin');

// Replace this with your real tests.
test('it works', function(assert) {
  var SortableColumnObject = Ember.Object.extend(SortableColumnMixin);
  var subject = SortableColumnObject.create();
  assert.ok(subject);
});
