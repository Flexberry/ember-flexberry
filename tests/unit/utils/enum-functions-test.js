import { createEnum, inverseEnum, enumCaptions } from 'ember-flexberry-data/utils/enum-functions';
import { module, test } from 'qunit';

module('Unit | Utility | enum functions');

let simpleEnum = Object.create(null);
simpleEnum.Value1 = 'Value1';
simpleEnum.Value2 = 'Value2';

let enumWithCaption = Object.create(null);
enumWithCaption.Value1 = 'Enum value 1';
enumWithCaption.Value2 = 'Enum value 2';

let invertedEnumWithCaption = Object.create(null);
invertedEnumWithCaption['Enum value 1'] = 'Value1';
invertedEnumWithCaption['Enum value 2'] = 'Value2';

test('createEnum returns object without prototype', function (assert) {
  let result = createEnum({});

  assert.notOk(result.prototype);
});

test('createEnum returns enum based on array', function (assert) {
  let result = createEnum(['Value1', 'Value2']);

  assert.deepEqual(result, simpleEnum);
});

test('createEnum returns enum based on object', function (assert) {
  let result = createEnum({
    Value1: 'Enum value 1',
    Value2: 'Enum value 2'
  });

  assert.deepEqual(result, enumWithCaption);
});

test('inverseEnum returns object without prototype', function (assert) {
  let result = inverseEnum({});

  assert.notOk(result.prototype);
});

test('inverseEnum returns inverted object', function (assert) {
  let result = inverseEnum(enumWithCaption);

  assert.deepEqual(result, invertedEnumWithCaption);
});

test('enumCaptions return array with caption properties', function(assert) {
  let result = enumCaptions(enumWithCaption);

  assert.deepEqual(result, ['Enum value 1', 'Enum value 2']);
});
