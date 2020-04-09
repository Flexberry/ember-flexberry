import cutStringByLength from 'dummy/utils/cut-string-by-length';
import { module, test } from 'qunit';

module('Unit | Utility | cut string by length');

test('cut by length', function(assert) {
  let result = cutStringByLength('test string', 6);
  assert.equal(result, 'test s...');

  result = cutStringByLength('test string', 20);
  assert.equal(result, 'test string');

  result = cutStringByLength('test string', 0);
  assert.equal(result, 'test string');

  result = cutStringByLength('test string', 3);
  assert.equal(result, 'tes...');
});

test('cut by spaces', function(assert) {
  let result = cutStringByLength('test string with spaces', 6, true);
  assert.equal(result, 'test...');

  result = cutStringByLength('test string with spaces', 50, true);
  assert.equal(result, 'test string with spaces');

  result = cutStringByLength('test string with spaces', 0, true);
  assert.equal(result, 'test string with spaces');

  result = cutStringByLength('test string with spaces', 3, true);
  assert.equal(result, 'tes...');

  result = cutStringByLength('test string with spaces', 18, true);
  assert.equal(result, 'test string with...');

  result = cutStringByLength('test string with spaces', 12, true);
  assert.equal(result, 'test string...');
});
