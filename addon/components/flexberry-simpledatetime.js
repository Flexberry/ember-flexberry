/**
  @module ember-flexberry
*/

import { computed, observer } from '@ember/object';
import { isBlank, isNone } from '@ember/utils';
import $ from 'jquery';
import moment from 'moment';
import { scheduleOnce } from '@ember/runloop';
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
      defaultHour=defaultHour
      defaultMinute=defaultMinute
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
  _valueAsDate: computed(() => null),

  /**
    Convert date in `value` to appropriate input datatype.
    For example, [see here](https://www.w3.org/TR/html-markup/input.datetime-local.html#input.datetime-local.attrs.value).

    @property _valueAsString
    @type String
    @default null
    @private
  */
  _valueAsString: computed(() => null),

  /**
    Convert date in `min` to appropriate input datatype.
    For example, [see here](https://www.w3.org/TR/html-markup/input.datetime-local.html#input.datetime-local.attrs.min).

    @property _minAsString
    @type String
    @default null
    @private
  */
  _minAsString: computed(() => null),

  /**
    Convert date in `max` to appropriate input datatype.
    For example, [see here](https://www.w3.org/TR/html-markup/input.datetime-local.html#input.datetime-local.attrs.max).

    @property _maxAsString
    @type String
    @default null
    @private
  */
  _maxAsString: computed(() => null),

  /**
    Checks whether the browser supports the date field.

    @property currentTypeSupported
    @type Boolean
    @readOnly
  */
  currentTypeSupported: computed('type', {
    get() {
      let type = this.get('type');
      let input = document.createElement('input');
      input.setAttribute('type', type);

      return input.type === type;
    },
  }).readOnly(),

  /**
    Type of date picker.

    @property type
    @default null
    @type String
  */
  type: computed(() => null),

  /**
    Flag indicates only flatpickr using for this component.

    @property useOnlyFlatpickr
    @default true
    @type Boolean
  */
  useBrowserInput: false,

  /**
    Value of date.

    @property value
    @type Date
  */
  value: computed('_valueAsString', '_valueAsDate', 'useBrowserInput', 'currentTypeSupported', {
    get() {
      if (this.get('useBrowserInput') && this.get('currentTypeSupported')) {
        if (this.get('type') === 'date') {
          return this._convertDateToLocal(this.get('_valueAsString'));
        }

        return this._convertStringToDate(this.get('_valueAsString'));
      } else {
        if (this.get('type') === 'date') {
          return this._convertDateToLocal(this.get('_valueAsDate'));
        }

        return this.get('_valueAsDate');
      }
    },
    set(key, value) {
      if (this.get('useBrowserInput') && this.get('currentTypeSupported')) {
        this.set('_valueAsString', this._convertDateToString(value));
      } else {
        this.set('_valueAsDate', value);
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
  min: computed('_minAsString', 'useBrowserInput', 'currentTypeSupported', {
    get() {
      return this.get('_minAsString');
    },
    set(key, value) {
      let minValue = value instanceof Date ? value.setMilliseconds(0) : moment(value).toDate().setMilliseconds(0);
      if (this.get('useBrowserInput') && this.get('currentTypeSupported')) {
        this.set('_minAsString', this._convertDateToString(minValue));
      }

      return value;
    },
  }),

  /**
    Maximum value of date.

    @property max
    @type Date
  */
  max: computed('_maxAsString', 'useBrowserInput', 'currentTypeSupported', {
    get() {
      return this.get('_maxAsString');
    },
    set(key, value) {
      let maxValue = value instanceof Date ? value.setMilliseconds(0) : moment(value).toDate().setMilliseconds(0);
      if (this.get('useBrowserInput') && this.get('currentTypeSupported')) {
        this.set('_maxAsString', this._convertDateToString(maxValue));
      }

      return value;
    },
  }),

  /**
    Default value of hour.

    @property defaultHour
    @default 12
    @type Integer
  */
  defaultHour: 12,

  /**
    Default value of minute.

    @property defaultMinute
    @default 0
    @type Integer
  */
  defaultMinute: 0,

  /**
    Text to be displayed in field, if field has not been filled.

    @property placeholder
    @type String
    @default 't('components.flexberry-simpledatetime.placeholder')'
  */
  placeholder: t('components.flexberry-simpledatetime.placeholder'),

  /**
    Array CSS class names.
    [More info.](https://emberjs.com/api/ember/release/classes/Component#property_classNames)

    @property classNames
    @type Array
    @readOnly
  */
  classNames: ['flexberry-simpledatetime'],

  /**
    Array CSS class names for scroll.

    @property scrollClassNames
    @type Array
  */
  scrollSelectors: computed(() => (['.full.height'])),

  /**
    Namespase for page event.

    @property eventNamespace
    @type String
  */
  eventNamespace: undefined,

  /**
    If true, then onClick calling flatpickr.open().

    @property canClick
    @type Bool
  */
  canClick: true,

  /**
    If undefined, then uses application locale.
    Supported locales: 'en', 'ru'.

    @property locale
    @type String
  */
  locale: undefined,

  /**
    If true, then flatpickr has remove button.

    @property removeButton
    @type Bool
  */
  removeButton: true,

  /**
    If true, then flatpickr has open button.

    @property openButton
    @type Bool
  */
  openButton: true,

  /**
    The selector to get the element (using `jQuery`) for [the `appendTo` flatpickr option](https://flatpickr.js.org/options/).

    @property calendarContext
    @type String
  */
  calendarContext: undefined,

  /**
    A string of characters which are used to define how the date will be displayed in the input box.
    The supported characters are defined in [the table below](https://flatpickr.js.org/formatting/).

    @property dateFormat
    @type String
  */
  dateFormat: 'Y-m-d',

  /**
    A string of characters which are used to define how the date will be displayed in the input box.
    The supported characters are defined in [the table below](https://flatpickr.js.org/formatting/).

    @property dateTimeFormat
    @type String
  */
  dateTimeFormat: 'Y-m-dTH:i',

  /**
    Exactly the same as date format, but for the altInput field.

    @property altDateFormat
    @type String
  */
  altDateFormat: 'd.m.Y',

  /**
    Exactly the same as date format, but for the altInput field.

    @property altDateTimeFormat
    @type String
  */
  altDateTimeFormat: 'd.m.Y H:i',

  /**
    Date mask.

    @property dateMask
    @type String
  */
  dateMask: '99.99.9999',

  /**
    DateTime mask.

    @property dateTimeMask
    @type String
  */
  dateTimeMask: '99.99.9999 99:99',

  /**
    Date format for validate.

    @property validDateFormat
    @type String
  */
  validDateFormat: 'DD.MM.YYYY',

  /**
    DateTime format for validate.

    @property validDateTimeFormat
    @type String
  */
  validDateTimeFormat: 'DD.MM.YYYY HH:mm',

  /**
    Path to component's settings in application configuration (JSON from ./config/environment.js).

    @property appConfigSettingsPath
    @type String
    @default 'APP.components.flexberrySimpledatetime'
  */
  appConfigSettingsPath: 'APP.components.flexberrySimpledatetime',

  /**
    See [EmberJS API](https://emberjs.com/api/).

    @method init
  */
  init() {
    this._super(...arguments);

    this.initProperty({ propertyName: 'calendarContext', defaultValue: undefined });
  },

  /**
    Initializes DOM-related component's logic.
  */
  didInsertElement() {
    this._super(...arguments);
    if (!(this.get('useBrowserInput') && this.get('currentTypeSupported'))) {
      this._flatpickrCreate();
    }
  },

  /**
    Called when the element of the view is going to be destroyed. Override this function to do any teardown that requires an element, like removing event listeners.
    [More info](https://emberjs.com/api/ember/release/classes/Component#event_willDestroyElement).

    @method willDestroyElement
  */
  willDestroyElement() {
    this._super(...arguments);
    this._flatpickrDestroy();

    let namespace = this.get('eventNamespace');
    $(this.get('scrollSelectors').join()).off(`scroll.${namespace}`);
    $(document).off(`mousedown.${namespace}`);
  },

  /**
    Component click handler.

    @method click
    @private
  */
  click() {
    if (this.get('canClick') && !(this.get('useBrowserInput') && this.get('currentTypeSupported')) && !this.get('readonly')) {
      this.set('canClick', false);
      this.get('_flatpickr').open();
    }
  },

  /**
    Validation date and time.

    @method _validationDateTime
    @private
  */
  _validationDateTime() {
    let dateIsValid = true;
    let inputValue = this.$('.custom-flatpickr')[0].value;
    let date = this.get('type') === 'date' ? moment(inputValue, this.validDateFormat) : moment(inputValue, this.validDateTimeFormat);
    if (date.isValid()) {
      let dateArray = inputValue.match(/(\d+)/g) || [];
      if (dateArray.length > 0) {
        let dateFormatArray = date._f.match(/([A-Z]+)/g) || [];
        let dateValid = dateFormatArray.find(function(item, index) {
          let dateElement;
          switch (item) {
            case 'DD':
              dateElement = date.date();
              break;
            case 'MM':
              dateElement = date.month() + 1;
              break;
            case 'YYYY':
              dateElement = date.year();
              break;
          }

          return !(dateElement === Number(dateArray[index]))
        });

        dateIsValid = this.get('type') === 'date' ? !dateValid : dateValid && date.hours() === Number(dateArray[3]) &&
          date.minutes() === Number(dateArray[4]);
      }
    } else {
      dateIsValid = false;
    }

    if (dateIsValid) {
      /* If before value was not set (undefined) then moment(this.get('_valueAsDate')) returns current date.
        If user input current date then moment(...).isSame(date) will return TRUE while in reality it is FALSE.*/
      let valueAsDate = this.get('_valueAsDate');
      if ((isNone(valueAsDate) && !isNone(date))
            || !moment(valueAsDate).isSame(date, this.get('type') === 'date' ? 'day' : 'second')) {
        this.get('_flatpickr').setDate(date.toDate());
        this.set('_valueAsDate', this.get('_flatpickr').selectedDates[0]);
      }
    } else {
      if (!isNone(inputValue)) {
        this.get('_flatpickr').clear();
        this.set('_valueAsDate', this.get('_flatpickr').selectedDates[0]);
      }
    }
  },

  _onChange() {
    const oldValue = this.get('value');
    this._validationDateTime();
    const newValue = this.get('value');

    if (newValue && newValue !== oldValue) {
      this.set('_valueAsDate', newValue);

      const onChange = this.get('onChange');
      if (typeof onChange === 'function') {
        onChange(newValue, oldValue);
      }
    }
  },

  /**
    Create Flatpickr instance, and save it into `_flatpickr` property.

    @method _flatpickrCreate
    @private
  */
  _flatpickrCreate() {
    const calendarContext = this.get('calendarContext');
    const timeless = this.get('type') === 'date';
    const min = this.get('min');
    const max = this.get('max');

    const options = {
      altInput: true,
      time_24hr: true,
      enableTime: !timeless,
      allowInput: true,
      clickOpens: false,
      disableMobile: true,
      altInputClass: 'custom-flatpickr',
      minDate: timeless && min ? moment(min).startOf('day').toDate() : min,
      maxDate: timeless && max ? moment(max).endOf('day').toDate() : max,
      defaultDate: this.get('value'),
      defaultHour: this.get('defaultHour'),
      defaultMinute: this.get('defaultMinute'),
      appendTo: calendarContext ? $(calendarContext).get(0) : undefined,
      locale: this.get('locale') || this.get('i18n.locale'),
      altFormat: timeless ? this.altDateFormat : this.altDateTimeFormat,
      dateFormat: timeless ? this.dateFormat : this.dateTimeFormat,
      onChange: () => {
        let inputValue = this.$('.custom-flatpickr')[0].value;
        if (!isBlank(inputValue)) {
          this._onChange();
        }
      },
      onClose: () => {
        this.set('canClick', true);
        this.$('.custom-flatpickr').blur();
      },
    };

    this.set('_flatpickr', this.$('.flatpickr > input').flatpickr(options));
    $('.flatpickr-calendar .numInput.flatpickr-hour').prop('readonly', true);
    $('.flatpickr-calendar .numInput.flatpickr-minute').prop('readonly', true);
    this.$('.custom-flatpickr').mask(timeless ? this.dateMask : this.dateTimeMask);

    this.$('.custom-flatpickr').change($.proxy(function () {
      this._onChange();
    }, this));

    this.$('.custom-flatpickr').keydown($.proxy(function (e) {
      if (e.which === 13) {
        this.$('.custom-flatpickr').blur();
        this._onChange();
        return false;
      }
    }, this));

    this.$('.custom-flatpickr').prop('readonly', this.get('readonly'));

    let namespace = this.elementId;
    this.set('eventNamespace', namespace);
    $(document).on(`mousedown.${namespace}`, (e) => {
      let clicky = $(e.target);
      if (clicky.closest('.flatpickr-calendar').length === 0 && clicky.get(0) !== this.$('.custom-flatpickr').get(0)) {
        this.get('_flatpickr').close();
      }
    });
    $(this.get('scrollSelectors').join()).on(`scroll.${namespace}`, () => this.get('_flatpickr').close());
  },

  /**
    Sets readonly attr for flatpickr.
  */
  readonlyObserver: observer('readonly', function() {
    this.$('.custom-flatpickr').prop('readonly', this.get('readonly'));
  }),

  /**
    Observer for reinit flatpickr (defaultHour, defaultMinute, and others, for dynamically updating because set() for this options doesn't update view).

    @method reinitFlatpickrObserver
  */
  reinitFlatpickrObserver: observer('type', 'min', 'max', 'locale', 'i18n.locale', 'defaultHour', 'defaultMinute', function () {
    if (!this.get('useBrowserInput') || !this.get('currentTypeSupported')) {
      this._flatpickrDestroy();
      scheduleOnce('afterRender', this, this._flatpickrCreate);
    }
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

  /**
    Converts date (without time) to local date.

    @method _convertDateToLocal
    @param {String|Date} value Date without timezone shift.
    @return {Date} Object of Date.
    @private
  */
  _convertDateToLocal(value) {
    let dateToSet = value;
    if (!isBlank(dateToSet)) {
      dateToSet.setHours(13);
      dateToSet.setUTCHours(11);
      dateToSet.setUTCMinutes(0);
      dateToSet.setUTCSeconds(0);
      dateToSet.setUTCMilliseconds(0);
    }

    return dateToSet;
  },

  actions: {
    /**
      Clear current value.

      @method actions.remove
    */
    remove() {
      if (!this.get('readonly')) {
        const flatpickr = this.get('_flatpickr');
        const value = this.get('value') || new Date();

        value.setHours(this.get('defaultHour'), this.get('defaultMinute'));

        flatpickr.setDate(value, false);
        flatpickr.clear();
        this._onChange();
      }
    },

    /**
      Open flatpickr.

      @method actions.open
    */
    open() {
      this.click();
    }
  }
});
