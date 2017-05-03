import { readonlyCell } from 'dummy/helpers/readonly-cell';
import { module, test } from 'qunit';

module('Unit | Helper | readonly cell');

test('it works', function(assert) {
  let result = readonlyCell([['test'], 'test', false]);
  assert.ok(result);
});
