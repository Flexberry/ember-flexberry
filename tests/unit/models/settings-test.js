import { test } from 'ember-qunit';
import Settings from 'ember-flexberry/models/settings';

test('it exists', function(assert) {
  var settings = Settings.create();
  assert.ok(!!settings);
});
