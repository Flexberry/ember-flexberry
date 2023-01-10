import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | list form', function (hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:list-form');
    assert.ok(route);
  });
});
