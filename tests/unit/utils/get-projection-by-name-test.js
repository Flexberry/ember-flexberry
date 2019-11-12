import getProjectionByName from 'dummy/utils/get-projection-by-name';
import { module, test } from 'qunit';

module('Unit | Utility | get projection by name');

// Replace this with your real tests.
test('it works', function(assert) {
  let store = {};
  store.modelFor = function() {
    return { projections: { testProjection: { success: true } } };
  };

  let result = getProjectionByName('testProjection', 'testModel', store);
  assert.ok(result && result.success);
});
