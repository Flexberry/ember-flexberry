import EmberObject from '@ember/object';
import MultiListModelMixin from 'ember-flexberry/mixins/multi-list-model';
import { module, test } from 'qunit';

module('Unit | Mixin | multi list model', function() {
  test('it works', function(assert) {
    let MultiListModelObject = EmberObject.extend(MultiListModelMixin);
    let subject = MultiListModelObject.create();
    assert.ok(subject);
  });
});
