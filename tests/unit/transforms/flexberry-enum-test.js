import { moduleFor, test } from 'ember-qunit';
import { createEnum } from 'ember-flexberry/utils/enum-functions';

moduleFor('transform:flexberry-enum', 'Unit | Transform | flexberry enum', {
});

let stringEnum = createEnum({
  enumValue: 'Value for string enum property'
});

let numberEnum = createEnum({
  32: 'Value for number enum property'
});

test('it should throw exception if no enum property set', function(assert) {
  assert.throws(() => {
    this.subject();
  });
});

test('it should deserialize enum value for string enums', function(assert) {
  let transform = this.subject({ enum: stringEnum });

  let deserialized = transform.deserialize('enumValue');

  assert.equal(deserialized, 'Value for string enum property');
});

test('it should serialize enum property for string enums', function(assert) {
  let transform = this.subject({ enum: stringEnum });

  let serialized = transform.serialize('Value for string enum property');

  assert.equal(serialized, 'enumValue');
});

test('it should deserialize enum value for number enums', function(assert) {
  let transform = this.subject({ enum: numberEnum });

  let deserialized = transform.deserialize(32);

  assert.equal(deserialized, 'Value for number enum property');
});

test('it should serialize enum property for number enums', function(assert) {
  let transform = this.subject({ enum: numberEnum });

  let serialized = transform.serialize('Value for number enum property');

  assert.equal(serialized, 32);
});
