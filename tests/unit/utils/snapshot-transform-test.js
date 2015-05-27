import SnapshotTransform from '../../../utils/snapshot-transform';
import { module, test } from 'qunit';

module('snapshotTransform');

test('it exists', function(assert) {
  var func = SnapshotTransform.transformForSerialize;
  assert.ok(func);
});
