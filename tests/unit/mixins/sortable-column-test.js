import Ember from 'ember';
import SortableColumnMixin from 'ember-flexberry/mixins/sortable-column';
import { module, test } from 'qunit';

module('SortableColumnMixin');

test('it works', function(assert) {
  var SortableColumnObject = Ember.Object.extend(SortableColumnMixin);
  var subject = SortableColumnObject.create();
  assert.ok(subject);
});
