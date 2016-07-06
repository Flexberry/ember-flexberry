import {
  moduleFor,
  test
} from 'ember-qunit';

moduleFor('route:application', {
  needs: []
});

test('it exists', function(assert) {
  var route = this.subject();
  assert.ok(route);
});
