import { test } from 'ember-qunit';
import Settings from '../../../models/settings';

test('it exists', function(assert) {
  var settings = Settings.create();
  assert.ok(!!settings);
});
