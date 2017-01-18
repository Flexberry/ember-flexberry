/**
  @module ember-flexberry
*/

import Ember from 'ember';
import FlexberryBaseComponent from './flexberry-base-component';
import moment from 'moment';
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
    Store current value as Date object.

    @property _valueAsDate
    @type Date
    @default null
    @private
  */
  _valueAsDate: Ember.computed(() => null),

  /**
    Convert date in `value` to appropriate input datatype.
    For example, [see here](https://www.w3.org/TR/html-markup/input.datetime-local.html#input.datetime-local.attrs.value).

    @property _valueAsString
    @type String
    @default null
    @private
  */
  _valueAsString: Ember.computed(() => null),

  /**
    Convert date in `min` to appropriate input datatype.
    For example, [see here](https://www.w3.org/TR/html-markup/input.datetime-local.html#input.datetime-local.attrs.min).

    @property _minAsString
    @type String
    @default null
    @private
  */
  _minAsString: Ember.computed(() => null),

  /**
    Convert date in `max` to appropriate input datatype.
    For example, [see here](https://www.w3.org/TR/html-markup/input.datetime-local.html#input.datetime-local.attrs.max).

    @property _maxAsString
    @type String
    @default null
    @private
  */
  _maxAsString: Ember.computed(() => null),

  /**
    Checks whether the browser supports the date field.

    @property currentTypeSupported
    @type Boolean
    @readOnly
  */
  currentTypeSupported: Ember.computed('type', {
    get() {
      let type = this.get('type');
      let input = document.createElement('input');
      input.setAttribute('type', type);
      if (input.type === type) {
        this._flatpickrDestroy();
        return true;
      } else {
        if (!this.get('_flatpickr')) {
          Ember.run.scheduleOnce('afterRender', this, '_flatpickrCreate');
        }

        return false;
      }
    },
  }).readOnly(),

  /**
    Type of date picker.

    @property type
    @default null
    @type String
  */
  type: Ember.computed(() => null),

  /**
    Value of date.

    @property value
    @type Date
  */
  value: Ember.computed('_valueAsString', '_valueAsDate', 'currentTypeSupported', {
    get() {
      if (this.get('currentTypeSupported')) {
        return this._convertStringToDate(this.get('_valueAsString'));
      } else {
        return this.get('_valueAsDate');
      }
    },
    set(key, value) {
      if (this.get('currentTypeSupported')) {
        this.set('_valueAsString', this._convertDateToString(value));
      } else {
        let flatpickr = this.get('_flatpickr');
        if (flatpickr) {
          flatpickr.setDate(value);
        }
      }

      return value;
    },
  }),

  /**
    Minimum value of date.

    @property min
    @type Date
  */
  min: Ember.computed('_minAsString', 'currentTypeSupported', {
    get() {
      return this.get('_minAsString');
    },
    set(key, value) {
      if (this.get('currentTypeSupported')) {
        this.set('_minAsString', this._convertDateToString(value));
      } else {
        let flatpickr = this.get('_flatpickr');
        if (flatpickr) {
          flatpickr.set('minDate', value);
        }
      }

      return value;
    },
  }),

  /**
    Maximum value of date.

    @property max
    @type Date
  */
  max: Ember.computed('_maxAsString', 'currentTypeSupported', {
    get() {
      return this.get('_maxAsString');
    },
    set(key, value) {
      if (this.get('currentTypeSupported')) {
        this.set('_maxAsString', this._convertDateToString(value));
      } else {
        let flatpickr = this.get('_flatpickr');
        if (flatpickr) {
          flatpickr.set('maxDate', value);
        }
      }

      return value;
    },
  }),

  /**
    Text to be displayed in field, if field has not been filled.

    @property placeholder
    @type String
    @default 't('components.flexberry-datepicker.placeholder')'
  */
  placeholder: t('components.flexberry-datepicker.placeholder'),

  /**
    Array CSS class names.
    [More info.](http://emberjs.com/api/classes/Ember.Component.html#property_classNames)

    @property classNames
    @type Array
    @readOnly
  */
  classNames: ['flexberry-simpledatetime'],

  /**
    Called when the element of the view is going to be destroyed. Override this function to do any teardown that requires an element, like removing event listeners.
    [More info](http://emberjs.com/api/classes/Ember.Component.html#event_willDestroyElement).

    @method willDestroyElement
  */
  willDestroyElement() {
    this._super(...arguments);
    this._flatpickrDestroy();
  },

  /**
    Component click handler.

    @method click
    @private
  */
  click() {
    if (!this.get('currentTypeSupported') && !this.get('readonly')) {
      this.get('_flatpickr').open();
    }
  },

  /**
    Create Flatpickr instance, and save it into `_flatpickr` property.

    @method _flatpickrCreate
    @private
  */
  _flatpickrCreate() {
    let options = {
      altInput: true,
      time_24hr: true,
      clickOpens: false,
      minDate: this.get('min'),
      maxDate: this.get('max'),
      defaultDate: this.get('value'),
      onChange: (dates) => {
        if (dates.length) {
          this.set('_valueAsDate', dates[dates.length - 1]);
        }
      },
    };

    let type = this.get('type');
    if (type === 'datetime-local' || type === 'datetime') {
      options.enableTime = true;
      options.altFormat = 'd.m.Y H:i';
      options.dateFormat = 'Y-m-dTH:i';
    } else {
      options.altFormat = 'd.m.Y';
    }

    this.set('_flatpickr', this.$('.flatpickr').flatpickr(options));
    this.$('.flatpickr').attr('readonly', this.get('readonly'));
  },

  /**
    Sets readonly attr for flatpickr.
  */
  readonlyObserver: Ember.observer('readonly', function() {
    this.$('.flatpickr').attr('readonly', this.get('readonly'));
  }),

  /**
    Destroy Flatpickr instance.

    @method _flatpickrDestroy
    @private
  */
  _flatpickrDestroy() {
    let flatpickr = this.get('_flatpickr');
    if (flatpickr) {
      flatpickr.destroy();
      this.set('_flatpickr', null);
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
    if (!value) {
      return null;
    }

    if (value instanceof Date) {
      let date = moment(value);
      switch (this.get('type')) {
        case 'datetime-local':
        case 'datetime':
          return date.format('YYYY-MM-DDTHH:mm');

        case 'date':
          return date.format('YYYY-MM-DD');

        default:
          throw new Error(`Not supported type:'${this.get('type')}'.`);
      }
    } else {
      throw new Error('Expected type of Date object.');
    }
  },

  /**
    Converts string value of input to Date object.

    @method _convertStringToDate
    @param {String} value Date in string format.
    @return {Date} Object of Date.
    @private
  */
  _convertStringToDate(value) {
    if (!value) {
      return null;
    }

    if (typeof value !== 'string') {
      throw new Error('Expected type the string.');
    }

    return moment(value).toDate();
  },
});
