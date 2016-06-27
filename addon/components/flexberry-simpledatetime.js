/**
  @module ember-flexberry
*/

import Ember from 'ember';
import FlexberryBaseComponent from './flexberry-base-component';

/**
  Wrapper for input[type='date/datetime/datetime-local'] component.
  **Please keep in mind that these input types are not supported in all browsers, [see supported browsers](http://caniuse.com/#feat=input-datetime).**

  Sample usage:
  ```handlebars
  {{flexberry-simpledatetime
    type='datetime-local'
    value=model.orderDate
    min=model.orderDateMin
    max=model.orderDateMax
  }}
  ```

  @class FlexberrySimpledatetime
  @extends FlexberryBaseComponent
*/
export default FlexberryBaseComponent.extend({
  /**
    Convert date in `value` to appropriate input datatype.
    For example, [see here](https://www.w3.org/TR/html-markup/input.datetime-local.html#input.datetime-local.attrs.value).

    @property _valueAsString
    @type String
    @private
  */
  _valueAsString: Ember.computed('value', {
    get() {
      let date = this.get('value');
      let str = this._convertDateToString(date);
      return str;
    },
    set(key, value) {
      let date = this._convertStringToDate(value);
      this.set('value', date);
      return value;
    },
  }),

  /**
    Convert date in `min` to appropriate input datatype.
    For example, [see here](https://www.w3.org/TR/html-markup/input.datetime-local.html#input.datetime-local.attrs.min).

    @property _minAsString
    @type String
    @private
  */
  _minAsString: Ember.computed('min', {
    get() {
      let date = this.get('min');
      let str = this._convertDateToString(date);
      return str;
    },
    set(key, value) {
      let date = this._convertStringToDate(value);
      this.set('min', date);
      return value;
    },
  }),

  /**
    Convert date in `max` to appropriate input datatype.
    For example, [see here](https://www.w3.org/TR/html-markup/input.datetime-local.html#input.datetime-local.attrs.max).

    @property _maxAsString
    @type String
    @private
  */
  _maxAsString: Ember.computed('max', {
    get() {
      let date = this.get('max');
      let str = this._convertDateToString(date);
      return str;
    },
    set(key, value) {
      let date = this._convertStringToDate(value);
      this.set('max', date);
      return value;
    },
  }),

  /**
    Value of date.

    @property value
    @type Date
  */
  value: undefined,

  /**
    Minimum value of date.

    @property min
    @type Date
  */
  min: undefined,

  /**
    Maximum value of date.

    @property max
    @type Date
  */
  max: undefined,

  /**
    Array CSS class names.
    [More info.](http://emberjs.com/api/classes/Ember.Component.html#property_classNames)

    @property classNames
    @type Array
    @readOnly
  */
  classNames: ['flexberry-simpledatetime'],

  /**
    Convert Date object to appropriate string value for input.

    @method _convertDateToString
    @param {Date} value Object of Date.
    @return {String} Date in string format.
    @private
  */
  _convertDateToString(value) {
    if (value == null) {
      return value;
    }

    if (typeof value !== 'object') {
      throw new Error('Value must be a Date object.');
    }

    let type = this.get('type');
    let str;
    switch (type) {
      case 'datetime-local':
        str = value.toISOString().replace('Z', '');
        break;
      case 'datetime':
        str = value.toISOString();
        break;
      case 'date':
        str = value.toISOString().split('T')[0];
        break;
      default:
        throw new Error(`type='${type}' is not supported.`);
    }

    return str;
  },

  /**
    Converts string value of input to Date object.

    @method _convertStringToDate
    @param {String} value Date in string format.
    @return {Date} Object of Date.
    @private
  */
  _convertStringToDate(value) {
    if (value == null) {
      return value;
    }

    if (value === '') {
      return null;
    }

    if (typeof value !== 'string') {
      throw new Error('Value must be a string.');
    }

    return new Date(value);
  },
});
