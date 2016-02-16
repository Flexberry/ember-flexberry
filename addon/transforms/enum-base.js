/**
 * @module ember-flexberry
 */

import Ember from 'ember';
import DS from 'ember-data';

/**
 * Base transform class that implements an enumeration type.
 * During serialization and deserialization it checks if value is not outside of accessible values and converts to expected type or back.
 *
 * @class EnumBaseTransform
 * @extends DS.Transform
 * @public
 */
var EnumBase = DS.Transform.extend({
  // TODO: captions support (add support of type OrderedSet?)
  /**
   * Available choises of enumeration.
   * It is required field in a derived class.
   *
   * @property values
   * @public
   * @type Array|Ember.Array|Object
   * @example
   *     ['Easy', 'Difficult', 'Hard']
   *     { Easy: 1, Difficult: 2, Hard: 3 }
   */
  values: null,

  /**
   * String that represents expected type of serialized enumeration values.
   * @property expectedSerializedType
   * @type String
   * @default null
   * @public
   */
  expectedSerializedType: null,

  /**
   * String that represents expected type of deserialized enumeration values.
   * @property expectedDeserializedType
   * @type String
   * @default null
   * @public
   */
  expectedDeserializedType: null,

  /**
   * Executes all basic validations and returns deserialized enumeration field.
   *
   * @method deserialize
   * @public
   *
   * @param {String|Number} serialized Serialized enumeration field.
   * @return {String} Deserialized enumeration field.
   * Returns `null` or `undefined` if `serialized` has one of these values.
   */
  deserialize: function(serialized) {
    if (serialized === null || serialized === undefined) {
      return serialized;
    }

    let deserialized;
    let actualSerializedType = Ember.typeOf(serialized);
    let expectedSerializedType = this.get('expectedSerializedType');
    if (actualSerializedType !== expectedSerializedType) {
      throw new Error(`Wrong type of serialized enumeration field: actual type is ${actualSerializedType}, but ${expectedSerializedType} was expected.`);
    }

    let values = this.values;
    let actualValuesType = Ember.typeOf(values);
    if (!(Ember.isArray(values) || actualValuesType === 'object')) {
      throw new Error(`Wrong type of enumeration values field: actial type is ${actualValuesType}, but array or object were expected.`);
    }

    deserialized = this.getDeserializedValue(serialized);
    if (deserialized === null || deserialized === undefined) {
      throw new Error(`Unable to find serialized enumeration field: ${serialized}.`);
    }

    return deserialized;
  },

  /**
   * Executes all basic validations and returns serialized enumeration field.
   *
   * @method serialize
   * @public
   *
   * @param {String} deserialized Deserialized enumeration field.
   * @return {String|Number} Serialized enumeration field.
   * Returns `null` or `undefined` if `deserialized` has one of these values.
   */
  serialize: function(deserialized) {
    if (deserialized === null || deserialized === undefined) {
      return deserialized;
    }

    let serialized;
    let actualDeserializedType = Ember.typeOf(deserialized);
    let expectedDeserializedType = this.get('expectedDeserializedType');
    if (actualDeserializedType !== expectedDeserializedType) {
      throw new Error(`Wrong type of deserialized enumeration field: actual type is ${actualDeserializedType}, but ${expectedDeserializedType} was expected.`);
    }

    let values = this.values;
    let actualValuesType = Ember.typeOf(values);
    if (!(Ember.isArray(values) || actualValuesType === 'object')) {
      throw new Error(`Wrong type of enumeration values field: actial type is ${actualValuesType}, but array or object were expected.`);
    }

    serialized = this.getSerializedValue(deserialized);
    if (serialized === null || serialized === undefined) {
      throw new Error(`Unable to find deserialized enumeration field: ${deserialized}.`);
    }

    return serialized;
  },

  /**
   * Returns deserialized enumeration field.
   *
   * @method deserialize
   * @public
   *
   * @param {String|Number} serialized Serialized enumeration field.
   * @return {String} Deserialized enumeration field.
   * Returns `null` or `undefined` if `values` does not contain serialized value.
   */
  getDeserializedValue: function(serialized) {
  },

  /**
   * Returns serialized enumeration field.
   *
   * @method getSerializedValue
   * @public
   *
   * @param {String} deserialized Deserialized enumeration field.
   * @return {String|Number} Serialized enumeration field.
   * Returns `null` or `undefined` if `values` does not contain deserialized value.
   */
  getSerializedValue: function(deserialized) {
  },

  /**
   * Returns enumeration values as genuine array.
   *
   * @method getAvailableValuesArray
   * @public
   *
   * @return {Array} Enumeration available values as genuine array.
   */
  getAvailableValuesArray: function() {
    let availableValues = [];
    let values = this.get('values');
    if (Ember.isArray(values)) {
      availableValues = Ember.typeOf(values.isArray) === 'function' ? values.toArray() : values;
    } else {
      availableValues = Object.getOwnPropertyNames(values);
    }

    return availableValues;
  },
});

// Define static members.
EnumBase.reopenClass({
  /**
   * Flag: indicates whether class represents enumeration.
   * It is useful in cases when we need to determine that the model attribute type is an enumeration.
   * @property isEnum
   * @type Boolean
   * @default true
   * @public
   * @static
   * @class EnumBaseTransform
   */
  isEnum: true
});

export default EnumBase;
