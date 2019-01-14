import { isArray } from '@ember/array';
import deserializeSortingParam from 'dummy/utils/deserialize-sorting-param';
import { module, test } from 'qunit';

module('Unit | Utility | deserialize sorting param');

// Replace this with your real tests.
test('it works', function(assert) {
  let stringToDeserialize = '+type.name-moderated';
  let result = deserializeSortingParam(stringToDeserialize);
  assert.ok(result);
  assert.ok(isArray(result));
  assert.equal(result.length, 2);
  assert.equal(result[0].propName, 'type.name');
  assert.equal(result[0].direction, 'asc');
  assert.equal(result[1].propName, 'moderated');
  assert.equal(result[1].direction, 'desc');
});

test('empty param string', function(assert) {
  let stringToDeserialize = '';
  let result = deserializeSortingParam(stringToDeserialize);
  assert.ok(result);
  assert.ok(isArray(result));
  assert.equal(result.length, 0);
});
