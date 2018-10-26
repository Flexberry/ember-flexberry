import { moduleFor, test } from 'ember-qunit';

moduleFor('controller:application', {
  needs: [
    'service:objectlistview-events',
    'service:app-state',
  ],
});

// Replace this with your real tests.
test('it exists', function(assert) {
  var controller = this.subject();
  assert.ok(controller);
});
