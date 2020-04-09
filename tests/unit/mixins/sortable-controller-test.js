import EmberObject from '@ember/object';
import SortableControllerMixin from 'ember-flexberry/mixins/sortable-controller';
import { module, test } from 'qunit';

module('SortableControllerMixin');

test('it works', function(assert) {
  var SortableControllerObject = EmberObject.extend(SortableControllerMixin);
  var subject = SortableControllerObject.create();
  assert.ok(subject);
});
