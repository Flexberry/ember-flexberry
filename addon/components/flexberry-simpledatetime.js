/**
 * @module ember-flexberry
 */

import Ember from 'ember';
import FlexberryBaseComponent from './flexberry-base-component';

/**
 * Wrapper for input[type='date/datetime/datetime-local'] component.

   Please keep in mind that these input types are not supported
   in all browsers: http://caniuse.com/#feat=input-datetime.

   Example:
   ```js
   {{flexberry-simpledatetime type='datetime-local' value=model.orderDate min=model.orderDateMin readonly=readonly}}
   ```

 * @class FlexberrySimpledatetime
 * @extends FlexberryBaseComponent
 */
export default FlexberryBaseComponent.extend({
  classNames: ['flexberry-simpledatetime'],

  /**
   * Value of this component.
   *
   * @property value
   * @type Date
   */
  value: undefined,

  /**
   * Minimum value of this component.
   *
   * @property min
   * @type Date
   */
  min: undefined,

  /**
   * Maximum value of this component.
   *
   * @property max
   * @type Date
   */
  max: undefined,

  /**
   * Converted date in `value` to appropriate input datatype.
   * For example, see https://www.w3.org/TR/html-markup/input.datetime-local.html#input.datetime-local.attrs.value.
   *
   * @property valueStr
   * @type String
   * @private
   */
  valueStr: Ember.computed('value', {
    get() {
      let date = this.get('value');
      let str = this.convertDateToString(date);
      return str;
    },
    set(key, value, oldvalue) {
      let date = this.convertStringToDate(value);
      this.set('value', date);
      return value;
    }
  }),

  /**
   * Converted date in `min` to appropriate input datatype.
   * For example, see https://www.w3.org/TR/html-markup/input.datetime-local.html#input.datetime-local.attrs.min.
   *
   * @property minStr
   * @type String
   * @private
   */
  minStr: Ember.computed('min', {
    get() {
      let date = this.get('min');
      let str = this.convertDateToString(date);
      return str;
    },
    set(key, value, oldvalue) {
      let date = this.convertStringToDate(value);
      this.set('min', date);
      return value;
    }
  }),

  /**
   * Converted date in `max` to appropriate input datatype.
   * For example, see https://www.w3.org/TR/html-markup/input.datetime-local.html#input.datetime-local.attrs.max.
   *
   * @property maxStr
   * @type String
   * @private
   */
  maxStr: Ember.computed('max', {
    get() {
      let date = this.get('max');
      let str = this.convertDateToString(date);
      return str;
    },
    set(key, value, oldvalue) {
      let date = this.convertStringToDate(value);
      this.set('max', date);
      return value;
    }
  }),

  /**
   * Converts Date object to appropriate string value for input.
   * @method convertDateToString
   * @private
   */
  convertDateToString: function(value) {
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
   * Converts string value of input to Date object.
   * @method convertStringToDate
   * @private
   */
  convertStringToDate: function(value) {
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
  }
});
