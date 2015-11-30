import Ember from 'ember';
import DS from 'ember-data';

/**
 * Base transform class that implements an enumeration type.
 * During serialization and deserialization it checks if value is not outside of accessible values and returns same string.
 *
 * @class EnumTransform
 * @extends DS.Transform
 * @public
 */
export default DS.Transform.extend({
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
   * Returns deserialized enumeration field.
   *
   * @method deserialize
   * @public
   *
   * @param {String} serialized Serialized enumeration field (name).
   * @return {String} Deserialized enumeration field (name).
   *                  Returns `null` or `undefined` if `serialized` has one of these values.
   */
  deserialize: function(serialized) {
    let serializedValue = serialized;
    if (serializedValue === null || serializedValue === undefined) {
      return serializedValue;
    }

    if (typeof serializedValue !== 'string') {
      throw new Error(`Wrong type of serialized enumeration field: ${typeof serializedValue}`);
    }

    let values = this.values;
    if (Ember.isArray(values)) {
      let index = values.indexOf(serializedValue);
      if (index === -1) {
        throw new Error(`Unable to find serialized enumeration field: ${serializedValue}`);
      }

      return serializedValue;
    }

    if (typeof values === 'object') {
      let index = values[serializedValue];
      if (index === null || index === undefined) {
        throw new Error(`Unable to find serialized enumeration field: ${serializedValue}`);
      }

      return serializedValue;
    }

    throw new Error(`Wrong type of values: ${typeof values}`);
  },

  /**
   * Returns serialized enumeration field.
   *
   * @method serialize
   * @public
   *
   * @param {String} deserialized Deserialized enumeration field (name).
   * @return {String} Serialized enumeration field (name).
   *                  Returns `null` or `undefined` if `deserialized` has one of these values.
   */
  serialize: function(deserialized) {
    let name = deserialized;
    if (name === null || name === undefined) {
      return name;
    }

    if (typeof name !== 'string') {
      throw new Error(`Wrong type of deserialized enumeration field: ${typeof name}`);
    }

    let values = this.values;
    if (Ember.isArray(values)) {
      let index = values.indexOf(name);
      if (index === -1) {
        throw new Error(`Unable to find deserialized enumeration field: ${name}`);
      }

      return deserialized;
    }

    if (typeof values === 'object') {
      let index = values[name];
      if (index === null || index === undefined) {
        throw new Error(`Unable to find deserialized enumeration field: ${name}`);
      }

      return deserialized;
    }

    throw new Error(`Wrong type of values: ${typeof values}`);
  }
});
