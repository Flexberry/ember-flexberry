import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import ProjectedModelFormRoute from 'ember-flexberry/routes/projected-model-form';

module('Unit | Route | projected model form', function (hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    var route = ProjectedModelFormRoute.create();
    assert.ok(route);
  });
});
