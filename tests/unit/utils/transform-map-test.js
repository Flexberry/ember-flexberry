import TransformMap from '../../../utils/transform-map';
import { module, test } from 'qunit';

module('Unit | Utility | transform map');

// Replace this with your real tests.
test('it works', function(assert) {
  let result = new TransformMap({});
  assert.ok(result);
});

test('it return caption for value for string values', function(assert) {
  let map = Object.create(null);
  map.enumValue = 'Value for enum property';
  let result = new TransformMap(map);

  assert.equal(result.getCaption('enumValue'), 'Value for enum property');
});

test('it return caption for value for numeric values', function(assert) {
  let map = Object.create(null);
  map[0] = 'Value for enum property';
  let result = new TransformMap(map);

  assert.equal(result.getCaption(0), 'Value for enum property');
});

test('it return value for caption for string values', function(assert) {
  let map = Object.create(null);
  map.enumValue = 'Value for enum property';
  let result = new TransformMap(map);

  assert.equal(result.getValue('Value for enum property'), 'enumValue');
});

test('it return value for caption for numeric values', function(assert) {
  let map = Object.create(null);
  map[0] = 'Value for enum property';
  let result = new TransformMap(map);

  assert.equal(result.getValue('Value for enum property'), 0);
});

test('it should return available captions', function(assert) {
  let map = Object.create(null);
  map.enumValue = 'Value for enum property';
  let result = new TransformMap(map);

  assert.deepEqual(result.captions, ['Value for enum property']);
});
