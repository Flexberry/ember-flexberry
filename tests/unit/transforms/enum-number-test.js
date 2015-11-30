import { moduleFor, test } from 'ember-qunit';

moduleFor('transform:enum-number', 'Unit | Transform | enum-number', {
  // Specify the other units that are required for this test.
  // needs: ['serializer:foo']
});

var arrayEnum = ['Пусто', 'Первая', 'Вторая'];
var objectEnum = { Пусто: 1, Первая: 2, Вторая: 3 };

test('it exists', function(assert) {
  var transform = this.subject();
  assert.ok(transform);
});

/**
   * It serializes enum value and compare with expected value.
   *
   * @assert Test entity.
   * @enumVariant {Array} or {Object} Enum to serialize its value.
   * @useAsThis Reference to 'this' of test methods.
   * @valueToChange {String} Value to serialize.
   * @expectedResult {String} Expected result of serialization.
   */
var serializeValues = function(assert, enumVariant, useAsThis, valueToChange, expectedResult) {
  var transform = useAsThis.subject();
  transform.values = enumVariant;
  var result = transform.serialize(valueToChange);
  assert.equal(result, expectedResult);
};

/**
   * It deserializes enum value and compare with expected value.
   *
   * @assert Test entity.
   * @enumVariant {Array} or {Object} Enum to deserialize its value.
   * @useAsThis Reference to 'this' of test methods.
   * @valueToChange {String} Value to deserialize.
   * @expectedResult {String} Expected result of deserialization.
   */
var deserializeValues = function(assert, enumVariant, useAsThis, valueToChange, expectedResult) {
  var transform = useAsThis.subject();
  transform.values = enumVariant;
  var result = transform.deserialize(valueToChange);
  assert.equal(result, expectedResult);
};

test('it serializes existing values from array', function(assert) {
  var existingValue = arrayEnum[0];
  serializeValues(assert, arrayEnum, this, existingValue, 0);
});

test('it deserializes existing values from array', function(assert) {
  var existingValue = arrayEnum[0];
  deserializeValues(assert, arrayEnum, this, 0, existingValue);
});

test('it serializes existing values from object', function(assert) {
  var existingValue = 'Пусто';
  serializeValues(assert, objectEnum, this, existingValue, 1);
});

test('it deserializes existing values from object', function(assert) {
  var existingValue = 'Пусто';
  deserializeValues(assert, objectEnum, this, 1, existingValue);
});

test('it does not serialize null', function(assert) {
  serializeValues(assert, objectEnum, this, null, null);
});

test('it does not deserialize null', function(assert) {
  deserializeValues(assert, objectEnum, this, null, null);
});

test('it does not serialize undefined', function(assert) {
  serializeValues(assert, objectEnum, this, undefined, undefined);
});

test('it does not deserialize undefined', function(assert) {
  deserializeValues(assert, objectEnum, this, undefined, undefined);
});

test('it throws error on serializing nonexisting values from array', function(assert) {
  var nonExistingValue = 'SomeNonExistingEnumValue';
  assert.throws(
    function() {
      serializeValues(assert, arrayEnum, this, nonExistingValue, 0);
    },
    Error
  );
});

test('it throws error on deserializing nonexisting values from array', function(assert) {
  var nonExistingValue = 10;
  assert.throws(
    function() {
      deserializeValues(assert, arrayEnum, this, nonExistingValue, nonExistingValue);
    },
    Error
  );
});

test('it throws error on serializing nonexisting values from object', function(assert) {
  var nonExistingValue = 'SomeNonExistingEnumValue';
  assert.throws(
    function() {
      serializeValues(assert, objectEnum, this, nonExistingValue, 0);
    },
    Error
  );
});

test('it throws error on deserializing nonexisting values from object', function(assert) {
  var nonExistingValue = 10;
  assert.throws(
    function() {
      deserializeValues(assert, objectEnum, this, nonExistingValue, nonExistingValue);
    },
    Error
  );
});

test('it throws error during serialization if parameter is not string', function(assert) {
  var existingValue = arrayEnum[0];
  assert.throws(
    function() {
      serializeValues(assert, existingValue, this, existingValue, existingValue);
    },
    Error
  );
});

test('it throws error during deserialization if parameter is not string', function(assert) {
  var existingValue = arrayEnum[0];
  assert.throws(
    function() {
      deserializeValues(assert, existingValue, this, existingValue, existingValue);
    },
    Error
  );
});

test('it throws error during serialization if enum is not array or object', function(assert) {
  var wrongValue = 1;
  assert.throws(
    function() {
      serializeValues(assert, arrayEnum, this, wrongValue, wrongValue);
    },
    Error
  );
});

test('it throws error during deserialization if enum is not array or object', function(assert) {
  var wrongValue = 'qwerty';
  assert.throws(
    function() {
      serializeValues(assert, arrayEnum, this, wrongValue, wrongValue);
    },
    Error
  );
});
