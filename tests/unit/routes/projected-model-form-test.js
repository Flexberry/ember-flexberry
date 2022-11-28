import { test, module } from 'qunit';
import ProjectedModelFormRoute from 'ember-flexberry/routes/projected-model-form';

module('route:projected-model-form');

test('it exists', function(assert) {
  let route = ProjectedModelFormRoute.create();
  assert.ok(route);
});
