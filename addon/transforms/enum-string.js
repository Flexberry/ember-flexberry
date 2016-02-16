/**
 * @module ember-flexberry
 */

import Ember from 'ember';
import EnumBaseTransform from '../transforms/enum-base';

/**
 * Base transform class that implements an enumeration type for strings.
 * During serialization and deserialization it checks if value is not outside of accessible values and converts to string or back.
 *
 * @class EnumStringTransform
 * @extends EnumBaseTransform
 * @public
 */
export default EnumBaseTransform.extend({
  /**
   * String that represents expected type of serialized enumeration values.
   * @property expectedSerializedType
   * @type String
   * @default 'string'
   * @public
   */
  expectedSerializedType: 'string',

  /**
   * String that represents expected type of deserialized enumeration values.
   * @property expectedDeserializedType
   * @type String
   * @default 'string'
   * @public
   */
  expectedDeserializedType: 'string',

  /**
   * Returns deserialized enumeration field (name).
   *
   * @method deserialize
   * @public
   *
   * @param {String} serialized Serialized enumeration field (index).
   * @return {String} Deserialized enumeration field (name).
   * Returns `null` or `undefined` if `values` does not contain serialized value.
   */
  getDeserializedValue: function(serialized) {
    let deserialized;
    let values = this.get('values');
    if (Ember.isArray(values)) {
      deserialized = values.indexOf(serialized) >= 0 ? serialized : undefined;
    } else {
      deserialized = values.hasOwnProperty(serialized) ? serialized : undefined;
    }

    return deserialized;
  },

  /**
   * Returns serialized enumeration field (index).
   *
   * @method getSerializedValue
   * @public
   *
   * @param {String} deserialized Deserialized enumeration field (name).
   * @return {String|Number} Serialized enumeration field (index).
   * Returns `null` or `undefined` if `values` does not contain deserialized value.
   */
  getSerializedValue: function(deserialized) {
    let serialized;
    let values = this.get('values');
    if (Ember.isArray(values)) {
      serialized = values.indexOf(deserialized) >= 0 ? deserialized : undefined;
    } else if (values.hasOwnProperty(deserialized)) {
      serialized = values.hasOwnProperty(deserialized) ? deserialized : undefined;
    }

    return serialized;
  }
});
