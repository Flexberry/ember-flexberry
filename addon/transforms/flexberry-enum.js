/**
 * @module ember-flexberry
 */

import DS from 'ember-data';
import { inverseEnum, enumCaptions } from '../utils/enum-functions';

/**
 * Base transform class that implements an enumeration type.
 * During serialization and deserialization it converts values to captions and vise versa.
 *
 * @class FlexberryEnumTransform
 * @public
 */

let FlexberryEnum = DS.Transform.extend({

  /**
   * Object that contains enum values and corresponding captions.
   * Must be overridden in inherited classes.
   *
   * Should be defined in app/enums/.
   *
   * ```js
   * // app/enums/order-status.js
   * import { createEnum } from 'ember-flexberry/utils/enum-functions';
   *
   * export default createEnum({
   *   Paid: 'Paid',
   *   InProcess: 'In process',
   *   Sended: 'Sended',
   *   Arrived: 'Arrived',
   *   NotArrived: 'Not arrived',
   *   Unknown: 'Unknown'
   * });
   *
   * // app/transforms/order-status
   * import FlexberryEnum from 'ember-flexberry/transforms/flexberry-enum';
   * import OrderStatus from '../enums/order-status';
   *
   * export default FlexberryEnum.extend({
   *   enum: OrderStatus
   * });
   * ```
   *
   * @property enum
   * @type {Object}
   * @default undefined
   * @public
   */
  enum: undefined,

  /**
   * Object with inversed enum, value from enum property will be is property here.
   *
   * @property inverse
   * @type {Object}
   * @default undefined
   * @public
   * @readonly
   */
  inverse: undefined,

  /**
   * Array that contains all values of enum properties.
   *
   * @property captions
   * @type {Array}
   * @default undefined
   * @public
   * @readonly
   */
  captions: undefined,

  /**
   * Returns deserialized enumeration field.
   *
   * @method deserialize
   * @public
   *
   * @param {String|Number} serialized Serialized enumeration field.
   * @return {String} Deserialized enumeration field.
   * Returns `null` or `undefined` if `serialized` has one of these values.
   */
  deserialize(serialized) {
    if (serialized === null || serialized === undefined) {
      return serialized;
    }

    return this.get('enum')[serialized];
  },

  /**
   * Returns serialized enumeration field.
   *
   * @method serialize
   * @public
   *
   * @param {String} deserialized Deserialized enumeration field.
   * @return {String|Number} Serialized enumeration field.
   * Returns `null` or `undefined` if `deserialized` has one of these values.
   */
  serialize(deserialized) {
    if (deserialized === null || deserialized === undefined) {
      return deserialized;
    }

    return this.get('inverse')[deserialized];
  },

  init() {
    let enumDictionary = this.get('enum');
    if (!enumDictionary) {
      throw new Error('Enum property is undefined');
    }

    this.set('inverse', inverseEnum(enumDictionary));
    this.set('captions', enumCaptions(enumDictionary));
  }
});

FlexberryEnum.reopenClass({
  /**
   * Flag: indicates whether class represents enumeration.
   * It is useful in cases when we need to determine that the model attribute type is an enumeration.
   * @property isEnum
   * @type Boolean
   * @default true
   * @public
   * @static
   * @class FlexberryEnumTransform
   */
  isEnum: true
});

export default FlexberryEnum;
