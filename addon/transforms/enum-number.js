import Ember from 'ember';
import DS from 'ember-data';

/**
 * Base transform class that implements an enumeration type.
 * During serialization and deserialization it checks if value is not outside of accessible values and converts to number or back.
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
   * @param {Number} serialized Serialized enumeration field (index).
   * @return {String} Deserialized enumeration field (name).
   *                  Returns `null` or `undefined` if `serialized` has
   *                  one of these values.
   */
  deserialize: function(serialized) {
    let index = serialized;
    if (index === null || index === undefined) {
      return index;
    }

    if (typeof index !== 'number') {
      throw new Error(`Wrong type of serialized enumeration field: ${typeof index}`);
    }

    let values = this.values;
    if (Ember.isArray(values)) {
      let stringIndex = index.toString();
      let name = Ember.get(values, stringIndex);
      if (name === null || name === undefined) {
        throw new Error(`Unable to find serialized enumeration field: ${index}`);
      }

      return name;
    }

    if (typeof values === 'object') {
      for (let key in values) {
        if (values.hasOwnProperty(key) && values[key] === index) {
          return key;
        }
      }

      throw new Error(`Unable to find serialized enumeration field: ${index}`);
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
   * @return {Number} Serialized enumeration field (index).
   *                  Returns `null` or `undefined` if `deserialized` has
   *                  one of these values.
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

      return index;
    }

    if (typeof values === 'object') {
      let index = values[name];
      if (index === null || index === undefined) {
        throw new Error(`Unable to find deserialized enumeration field: ${name}`);
      }

      return index;
    }

    throw new Error(`Wrong type of values: ${typeof values}`);
  }
});
