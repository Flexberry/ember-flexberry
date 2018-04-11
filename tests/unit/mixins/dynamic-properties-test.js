import EmberObject, { set }  from '@ember/object';
import { A } from '@ember/array';
import { typeOf } from '@ember/utils';
import DynamicPropertiesMixin from 'ember-flexberry/mixins/dynamic-properties';
import { module, test } from 'qunit';

let ClassWithDynamicPropertiesMixin = EmberObject.extend(DynamicPropertiesMixin, {});

module('Unit | Mixin | dynamic-properties mixin');

test('Mixin throws assertion failed exception if specified \'dynamicProperties\' property is not an \'object\' or an \'instance\'', function (assert) {
  let wrongDynamicPropertiesArray = A([1, true, false, 'some string', [], function() {}, new Date(), new RegExp()]);

  assert.expect(wrongDynamicPropertiesArray.length);

  wrongDynamicPropertiesArray.forEach((wrongDynamicProperties) => {
    try {
      ClassWithDynamicPropertiesMixin.create({ dynamicProperties: wrongDynamicProperties });
    } catch (ex) {
      assert.strictEqual(
        (/wrong\s*type\s*of\s*.*dynamicProperties.*/gi).test(ex.message),
        true,
        'Throws assertion failed exception if specified \'dynamicProperties\' property is \'' + typeOf(wrongDynamicProperties) + '\'');
    }
  });
});

test('Mixin assignes it\'s owner\'s properties form the specified \'dynamicProperties\'', function (assert) {
  assert.expect(1);

  let propertyValue = 'MyValue';
  let dynamicProperties = { property: propertyValue };
  let mixinOwner = ClassWithDynamicPropertiesMixin.create({ dynamicProperties: dynamicProperties });

  assert.strictEqual(
    mixinOwner.get('property'), propertyValue,
    'Owner\'s properties are equals to related \'dynamicProperties\'');
});

test('Mixin changes it\'s owner\'s properties (when something changes inside related \'dynamicProperties\')', function (assert) {
  assert.expect(2);

  let propertyValue = 'MyValue';
  let dynamicProperties = { property: propertyValue };
  let mixinOwner = ClassWithDynamicPropertiesMixin.create({ dynamicProperties: dynamicProperties });

  assert.strictEqual(
    mixinOwner.get('property'), propertyValue,
    'Owner\'s properties are equals to related \'dynamicProperties\'');

  let propertyChangedValue = 'MyChangedValue';
  set(dynamicProperties, 'property', propertyChangedValue);

  assert.strictEqual(
    mixinOwner.get('property'), propertyChangedValue,
    'Owner\'s properties changes when values inside \'dynamicProperties\' changes');
});

test('Mixin removes old & adds new owner\'s properties (when reference to whole \'dynamicProperties\' object changes)', function (assert) {
  assert.expect(22);

  let propertyValue = 'MyProperty';
  let anotherPropertyValue = 'MyAnotherProperty';
  let dynamicProperties = { property: propertyValue, anotherProperty: anotherPropertyValue };

  let usualPropertyValue = 'MyUsualProperty';

  let mixinOwner = ClassWithDynamicPropertiesMixin.create({
    usualProperty: usualPropertyValue,
    dynamicProperties: dynamicProperties
  });

  assert.strictEqual(
    mixinOwner.get('usualProperty'), usualPropertyValue,
    'Owner\'s \'usualProperty\' is equals to it\'s initially defined value');
  assert.strictEqual(
    mixinOwner.get('property'), propertyValue,
    'Owner\'s \'property\' is equals to related dynamicProperty');
  assert.strictEqual(
    mixinOwner.get('anotherProperty'), anotherPropertyValue,
    'Owner\'s \'anotherProperty\' is equals to related dynamicProperty');

  let ownerPropertiesNames = A(Object.keys(mixinOwner));
  assert.strictEqual(
    ownerPropertiesNames.includes('usualProperty'), true,
    'Owner\'s properties keys contains \'usualProperty\'');
  assert.strictEqual(
    ownerPropertiesNames.includes('property'), true,
    'Owner\'s properties keys contains \'property\'');
  assert.strictEqual(
    ownerPropertiesNames.includes('anotherProperty'), true,
    'Owner\'s properties keys contains \'anotherProperty\'');

  let newPropertyValue = 'MyNewProperty';
  let newAnotherPropertyValue = 'MyNewAnotherProperty';
  let newDynamicProperties = { newProperty: newPropertyValue, newAnotherProperty: newAnotherPropertyValue };
  mixinOwner.set('dynamicProperties', newDynamicProperties);

  assert.strictEqual(
    mixinOwner.get('usualProperty'), usualPropertyValue,
    'Owner\'s \'usualProperty\' is equals to it\'s initially defined value (after change of whole \'dynamicProperties\' object)');
  assert.strictEqual(
    typeOf(mixinOwner.get('property')), 'undefined',
    'Owner\'s \'property\' is undefined (after change of whole \'dynamicProperties\' object)');
  assert.strictEqual(
    typeOf(mixinOwner.get('anotherProperty')), 'undefined',
    'Owner\'s \'anotherProperty\' is undefined (after change of whole \'dynamicProperties\' object)');
  assert.strictEqual(
    mixinOwner.get('newProperty'), newPropertyValue,
    'Owner\'s \'newProperty\' is equals to related dynamicProperty (after change of whole \'dynamicProperties\' object)');
  assert.strictEqual(
    mixinOwner.get('newAnotherProperty'), newAnotherPropertyValue,
    'Owner\'s \'newAnotherProperty\' is equals to related dynamicProperty (after change of whole \'dynamicProperties\' object)');

  ownerPropertiesNames = A(Object.keys(mixinOwner));
  assert.strictEqual(
    ownerPropertiesNames.includes('usualProperty'), true,
    'Owner\'s properties keys contains \'usualProperty\' (after change of whole \'dynamicProperties\' object)');
  assert.strictEqual(
    ownerPropertiesNames.includes('property'), false,
    'Owner\'s properties keys doesn\'t contains \'property\' (after change of whole \'dynamicProperties\' object)');
  assert.strictEqual(
    ownerPropertiesNames.includes('anotherProperty'), false,
    'Owner\'s properties keys doesn\'t contains \'anotherProperty\' (after change of whole \'dynamicProperties\' object)');
  assert.strictEqual(
    ownerPropertiesNames.includes('newProperty'), true,
    'Owner\'s properties keys contains \'newProperty\' (after change of whole \'dynamicProperties\' object)');
  assert.strictEqual(
    ownerPropertiesNames.includes('newAnotherProperty'), true,
    'Owner\'s properties keys contains \'newAnotherProperty\' (after change of whole \'dynamicProperties\' object)');

  mixinOwner.set('dynamicProperties', null);
  assert.strictEqual(
    mixinOwner.get('usualProperty'), usualPropertyValue,
    'Owner\'s \'usualProperty\' is equals to it\'s initially defined value (after change of whole \'dynamicProperties\' object to null)');
  assert.strictEqual(
    typeOf(mixinOwner.get('newProperty')), 'undefined',
    'Owner\'s \'newProperty\' is undefined (after change of whole \'dynamicProperties\' object to null)');
  assert.strictEqual(
    typeOf(mixinOwner.get('newAnotherProperty')), 'undefined',
    'Owner\'s \'newAnotherProperty\' is undefined (after change of whole \'dynamicProperties\' object to null)');

  ownerPropertiesNames = A(Object.keys(mixinOwner));
  assert.strictEqual(
    ownerPropertiesNames.includes('usualProperty'), true,
    'Owner\'s properties keys contains \'usualProperty\' (after change of whole \'dynamicProperties\' object to null)');
  assert.strictEqual(
    ownerPropertiesNames.includes('newProperty'), false,
    'Owner\'s properties keys doesn\'t contains \'newProperty\' (after change of whole \'dynamicProperties\' object to null)');
  assert.strictEqual(
    ownerPropertiesNames.includes('newAnotherProperty'), false,
    'Owner\'s properties keys doesn\'t contains \'newAnotherProperty\' (after change of whole \'dynamicProperties\' object to null)');
});

test('Mixin removes assigned \'dynamicProperties\' before owner will be destroyed', function (assert) {
  assert.expect(12);

  let propertyValue = 'MyProperty';
  let anotherPropertyValue = 'MyAnotherProperty';
  let dynamicProperties = { property: propertyValue, anotherProperty: anotherPropertyValue };

  let usualPropertyValue = 'MyUsualProperty';

  let mixinOwner = ClassWithDynamicPropertiesMixin.create({
    usualProperty: usualPropertyValue,
    dynamicProperties: dynamicProperties
  });

  assert.strictEqual(
    mixinOwner.get('usualProperty'), usualPropertyValue,
    'Owner\'s \'usualProperty\' is equals to it\'s initially defined value');
  assert.strictEqual(
    mixinOwner.get('property'), propertyValue,
    'Owner\'s \'property\' is equals to related dynamicProperty');
  assert.strictEqual(
    mixinOwner.get('anotherProperty'), anotherPropertyValue,
    'Owner\'s \'anotherProperty\' is equals to related dynamicProperty');

  let ownerPropertiesNames = A(Object.keys(mixinOwner));
  assert.strictEqual(
    ownerPropertiesNames.includes('usualProperty'), true,
    'Owner\'s properties keys contains \'usualProperty\'');
  assert.strictEqual(
    ownerPropertiesNames.includes('property'), true,
    'Owner\'s properties keys contains \'property\'');
  assert.strictEqual(
    ownerPropertiesNames.includes('anotherProperty'), true,
    'Owner\'s properties keys contains \'anotherProperty\'');

  mixinOwner.willDestroy();

  assert.strictEqual(
    mixinOwner.get('usualProperty'), usualPropertyValue,
    'Owner\'s \'usualProperty\' is equals to it\'s initially defined value (after change of whole \'dynamicProperties\' object)');
  assert.strictEqual(
    typeOf(mixinOwner.get('property')), 'undefined',
    'Owner\'s \'property\' is undefined (after change of whole \'dynamicProperties\' object)');
  assert.strictEqual(
    typeOf(mixinOwner.get('anotherProperty')), 'undefined',
    'Owner\'s \'anotherProperty\' is undefined (after change of whole \'dynamicProperties\' object)');

  ownerPropertiesNames = A(Object.keys(mixinOwner));
  assert.strictEqual(
    ownerPropertiesNames.includes('usualProperty'), true,
    'Owner\'s properties keys contains \'usualProperty\'');
  assert.strictEqual(
    ownerPropertiesNames.includes('property'), false,
    'Owner\'s properties keys doesn\'t contains \'property\'');
  assert.strictEqual(
    ownerPropertiesNames.includes('anotherProperty'), false,
    'Owner\'s properties keys doesn\'t contains \'anotherProperty\'');
});
