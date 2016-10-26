/**
  @module ember-flexberry
*/

import Ember from 'ember';
import FlexberryBaseComponent from './flexberry-base-component';
import { translationMacro as t } from 'ember-i18n';

/**
  Wrapper for input[type='date/datetime/datetime-local'] component.
  **Please keep in mind that these input types are not supported in all browsers, [see supported browsers](http://caniuse.com/#feat=input-datetime).**

  @example
    ```handlebars
    {{flexberry-simpledatetime
      type="datetime-local"
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
      if (this.get('_supportDateType')) {
        return this._convertDateToString(date);
      } else {
        return date;
      }
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
      if (this.get('_supportDateType')) {
        return this._convertDateToString(date);
      } else {
        return date;
      }
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
      if (this.get('_supportDateType')) {
        return this._convertDateToString(date);
      } else {
        return date;
      }
    },
    set(key, value) {
      let date = this._convertStringToDate(value);
      this.set('max', date);
      return value;
    },
  }),

  _supportDateType: Ember.computed(function() {
    if (this._checkInput('date') || this._checkInput('datetime') || this._checkInput('datetime-local')) {
      return true;
    }

    return false;
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
    Text to be displayed in field, if field has not been filled.

    @property placeholder
    @type String
    @default 't('components.flexberry-datepicker.placeholder')'
  */
  placeholder: t('components.flexberry-datepicker.placeholder'),

  /**
    Flatpickr options.
    For more information see [flatpickr](https://chmln.github.io/flatpickr/)
  */
  dateFormat: 'Y-m-dTH:iZ',
  timeFormat: 'H:i',
  noCalendar: false,
  enableTime: true,
  enableSeconds: false,
  time_24hr: true,
  utc: true,
  altInput: true,
  altFormat: 'd.m.Y H:i',

  /**
    Called when the element of the view has been inserted into the DOM or after the view was re-rendered.
    For more information see [didInsertElement](http://emberjs.com/api/classes/Ember.Component.html#event_didInsertElement) event of [Ember.Component](http://emberjs.com/api/classes/Ember.Component.html).
  */
  didInsertElement() {
    this._super(...arguments);

    if (!this.get('_supportDateType')) {
      this._setFlatpickrOptionsWithType();
      this.$('.flatpickr')[0].flatpickr({
        dateFormat: this.get('dateFormat'),
        timeFormat: this.get('timeFormat'),
        defaultDate: this.get('_valueAsString'),
        noCalendar: this.get('noCalendar'),
        enableTime: this.get('enableTime'),
        enableSeconds: this.get('enableSeconds'),
        time_24hr: this.get('time_24hr'),
        utc: this.get('utc'),
        minDate: this.get('_minAsString'),
        maxDate: this.get('_maxAsString'),
        altInput: this.get('altInput'),
        altFormat: this.get('altFormat'),
      });
    }
  },

  /**
    This method set flatpickr options depending on the type.

    @method _setFlatpickrOptionsWithType
    @private
  */
  _setFlatpickrOptionsWithType() {
    let type = this.get('type');
    switch (type) {
      case 'datetime-local':
        this.set('utc', true);
        break;
      case 'datetime':
        break;
      case 'date':
        this.set('altFormat', 'd.m.Y');
        this.set('enableTime', false);
        break;
    }
  },

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

  /**
    The method checks if some input type is supported by the browser.

    @method _checkInput
    @param {String} type Type of input.
    return {Boolean}
    @private
  */
  _checkInput(type) {
    let input = document.createElement('input');
    input.setAttribute('type', type);
    return input.type === type;
  },
});
