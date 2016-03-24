/**
 * @module ember-flexberry
 */

import DS from 'ember-data';

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
   * Should be defined in app/enums/.
   * Should be overridden in inherited classes.
   *
   * @property transformMap
   * @type TransformMap
   * @default undefined
   * @public
   */
  transformMap: undefined,

  deserialize(serialized) {
    return this.get('transformMap').getCaption(serialized);
  },

  serialize(deserialized) {
    return this.get('transformMap').getValue(deserialized);
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
