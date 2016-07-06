/**
  @module ember-flexberry
*/

import Ember from 'ember';
import DS from 'ember-data';
import { inverseEnum, enumCaptions } from '../utils/enum-functions';

/**
  Base transform class that implements an enumeration type.
  During serialization\deserialization it converts values to captions and vise versa.

  @class FlexberryEnumTransform
  @extends <a href="http://emberjs.com/api/data/classes/DS.Transform.html">DS.Transform</a>
*/
let FlexberryEnum = DS.Transform.extend({

  /**
    Object that contains enum values and corresponding captions.
    Must be overridden in inherited classes.

    Should be defined in app/enums/.

    @example
      ```js
      // app/enums/order-status.js
      import { createEnum } from 'ember-flexberry/utils/enum-functions';

      export default createEnum({
        Paid: 'Paid',
        InProcess: 'In process',
        Sent: 'Sent',
        Arrived: 'Arrived',
        NotArrived: 'Not arrived',
        Unknown: 'Unknown'
      });

      // app/transforms/order-status
      import FlexberryEnum from 'ember-flexberry/transforms/flexberry-enum';
      import OrderStatus from '../enums/order-status';

      export default FlexberryEnum.extend({
        enum: OrderStatus
      });
      ```

    @property enum
    @type Object
  */
  enum: undefined,

  /**
    Object with inversed enum, value from enum property will be is property here.

    @property inverse
    @type Object
    @readOnly
  */
  inverse: undefined,

  /**
    Array that contains all values of enum properties.

    @property captions
    @type Array
    @readOnly
  */
  captions: undefined,

  /**
    An overridable method called when objects are instantiated.
    For more information see [init](http://emberjs.com/api/classes/Ember.View.html#method_init) method of [Ember.View](http://emberjs.com/api/classes/Ember.View.html).
  */
  init() {
    let enumDictionary = this.get('enum');
    if (Ember.isNone(enumDictionary)) {
      throw new Error('Enum property is undefined');
    }

    this.set('inverse', inverseEnum(enumDictionary));
    this.set('captions', enumCaptions(enumDictionary));
  },

  /**
    Returns deserialized enumeration field.
    Returns `null` or `undefined` if `serialized` has one of these values.

    @method deserialize
    @param {String|Number} serialized Serialized enumeration field
    @return {String} Deserialized enumeration field
  */
  deserialize(serialized) {
    if (serialized === null || serialized === undefined) {
      return serialized;
    }

    let deserialize = this.get('enum')[serialized];

    if (Ember.isNone(deserialize)) {
      throw new Error(`Unable to find serialized enumeration field: '${serialized}'.`);
    }

    return deserialize;
  },

  /**
    Returns serialized enumeration field.
    Returns `null` or `undefined` if `deserialized` has one of these values.

    @method serialize
    @param {String} deserialized Deserialized enumeration field
    @return {String|Number} Serialized enumeration field
  */
  serialize(deserialized) {
    if (deserialized === null || deserialized === undefined) {
      return deserialized;
    }

    let serialized = this.get('inverse')[deserialized];
    if (Ember.isNone(serialized)) {
      throw new Error(`Unable to find deserialized enumeration field: '${deserialized}.'`);
    }

    return serialized;
  }
});

FlexberryEnum.reopenClass({
  /**
    Flag: indicates whether class represents enumeration.
    It is useful in cases when we need to determine that the model attribute type is an enumeration.

    @static
    @for FlexberryEnumTransform
    @property isEnum
    @type Boolean
    @default true
  */
  isEnum: true
});

export default FlexberryEnum;
