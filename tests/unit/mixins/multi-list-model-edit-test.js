import EmberObject from '@ember/object';
import MultiListModelEditMixin from 'ember-flexberry/mixins/multi-list-model-edit';
import { module, test } from 'qunit';

module('Unit | Mixin | multi list model edit', function() {
  test('it works', function(assert) {
    let MultiListModelEditObject = EmberObject.extend(MultiListModelEditMixin);
    let subject = MultiListModelEditObject.create();
    assert.ok(subject);
  });
});
