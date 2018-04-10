/**
  @module ember-flexberry
*/

import { run } from '@ember/runloop';
import { observer } from '@ember/object';
import moment from 'moment';
import FlexberryBaseComponent from './flexberry-base-component';
import { translationMacro as t } from 'ember-i18n';

/**
  DateTime picker component for Semantic UI (Semantic UI hasn't its own DateTime picker component yet).
  # Need refactoring.

  @example
    ```handlebars
    {{flexberry-datepicker
      value=model.birthday
      placeholder='(no value)'
      hasTimePicker=true
      minDate='01.01.2000'
      maxDate='31.12.2020'
    }}
    ```

  @class FlexberryDatePicker
  @extends FlexberryBaseComponent
*/
export default FlexberryBaseComponent.extend({
  /**
    Input value.

    @property value
    @type Date
  */
  value: undefined,

  /**
    The placeholder attribute.

    @property placeholder
    @type String
    @default t('components.flexberry-datepicker.placeholder')
  */
  placeholder: t('components.flexberry-datepicker.placeholder'),

  /**
    Type of input element for render.
    In @type not used Markdown, so that [HTMLAttribute](https://www.w3.org/TR/html5/forms.html#attr-input-type).

    @property type
    @type HTMLAttribute
    @default text
  */
  type: 'text',

  /**
    Flag: show time in control and time picker inside date picker.

    @property hasTimePicker
    @type Boolean
    @default false
  */
  hasTimePicker: false,

  /**
    Invalid date for set to model value when needed.

    @property invalidDate
    @type Date
    @default Invalid Date
  */
  invalidDate: new Date('invalid'),

  /**
    Default display format.

    @property dateTimeFormat
    @type String
    @default 'DD.MM.YYYY'
  */
  dateTimeFormat: 'DD.MM.YYYY',

  /**
    The earliest date a user may select.

    @property minDate
    @type Date
  */
  minDate: undefined,

  /**
    Whether the calendar opens below ('down' by default) or above ('up') the element it's attached to.

    @property drops
    @type String
    @default 'down'
  */
  drops: 'down',

  /**
    The latest date a user may select.

    @property maxDate
    @type Date
  */
  maxDate: undefined,

  /**
    Array CSS class names.
    [More info.](http://emberjs.com/api/classes/Ember.Component.html#property_classNames)

    @property classNames
    @type Array
    @readOnly
  */
  classNames: ['ui', 'icon', 'input', 'flexberry-datepicker'],

  /**
    Init component when DOM is ready.
  */
  didInsertElement() {
    this.minDate = this.minDate === undefined ? moment('01.01.1900', this.dateTimeFormat) : moment(this.minDate, this.dateTimeFormat);
    this.maxDate = this.maxDate === undefined ? moment('31.12.9999', this.dateTimeFormat) : moment(this.maxDate, this.dateTimeFormat);

    let hasTimePicker = this.get('hasTimePicker');
    if (hasTimePicker) {
      this.dateTimeFormat = 'DD.MM.YYYY HH:mm:ss';
    }

    let val = this.get('value');
    let startDate = moment(new Date());
    if (val !== undefined && moment(val).isValid()) {
      startDate = moment(val);
      this.$('input').val(startDate.format(this.dateTimeFormat));
    }

    let drops = this.get('drops');
    let readonly = this.get('readonly');
    let _this = this;
    let i18n = _this.get('i18n');
    if (!readonly) {
      this.$('input').daterangepicker(
      {
        startDate: startDate,
        locale: {
          applyLabel: i18n.t('components.flexberry-datepicker.apply-button-text'),
          cancelLabel: i18n.t('components.flexberry-datepicker.cancel-button-text')
        },
        singleDatePicker: true,
        showDropdowns: true,
        timePicker: hasTimePicker,
        timePickerIncrement: 1,
        timePicker12Hour: false,
        timePickerSeconds: true,
        minDate: this.minDate,
        maxDate: this.maxDate,
        format: this.dateTimeFormat,
        drops: drops
      },
      function(start) {
        _this._setValue(start);
      });
      this.$('i').click(function() {
        _this.$('input').trigger('click');
      });
      this.$('input').on('apply.daterangepicker', function(ev, picker) {
        let currentValue = _this.get('value');
        let pickerDateString = moment(picker.startDate.toDate()).format(_this.dateTimeFormat);

        // TODO: refactor
        let tmp = !moment(moment(currentValue).format(_this.dateTimeFormat), _this.dateTimeFormat).isSame(moment(pickerDateString, _this.dateTimeFormat));
        if (!currentValue || tmp) {
          _this._setValue(picker.startDate);
        }
      });
      this.$('input').on('cancel.daterangepicker', function(ev, picker) {
        let currentInputValueString = _this.$('input').val();
        let pickerDateString = picker.startDate.format(_this.dateTimeFormat);

        // TODO: refactor
        let tmp = moment(currentInputValueString, _this.dateTimeFormat);
        let tmp2 = !moment(tmp.format(_this.dateTimeFormat), _this.dateTimeFormat).isSame(moment(pickerDateString, _this.dateTimeFormat));
        if (tmp2) {
          let oldPickerDateString = picker.startDate._i;
          if (typeof (oldPickerDateString) === 'string' && currentInputValueString !== oldPickerDateString) {
            _this.$('input').val(oldPickerDateString);
          }

          let currentValue = _this.get('value');
          if (!moment(moment(currentValue).format(_this.dateTimeFormat), _this.dateTimeFormat).isSame(moment(pickerDateString, _this.dateTimeFormat))) {
            _this._setValue(picker.startDate);
          }
        }
      });
      this.$('input').on('show.daterangepicker', function(ev, picker) {
        if (!picker.endDate.isValid()) {
          _this.$('input').data('daterangepicker').startDate = moment.invalid();
        }

        _this._setCalendarEnabledState();
      });
      this.$('input').keyup(function() {
        let valueFromInput = _this.$(this).val();
        _this._setValue(moment(valueFromInput, _this.dateTimeFormat));
      });
    }
  },

  /**
    Get JS Date object from Moment object.

    @method _getDateToSet
    @param {Moment} dateFromPicker Object of Moment.
    @private
  */
  _getDateToSet(dateFromPicker) {
    if (!dateFromPicker.isValid()) {
      return this.invalidDate;
    }

    if (dateFromPicker.isBefore(this.minDate) || dateFromPicker.isAfter(this.maxDate)) {
      return this.invalidDate;
    }

    return dateFromPicker.toDate();
  },

  /**
    Set value.

    @method setValue
    @param {Moment} dateFromPicker Object of Moment.
    @private
  */
  _setValue(dateFromPicker) {
    run(() => {
      let valueFromInput = this.$('input').val();
      if (valueFromInput === '' && !dateFromPicker.isValid()) {
        this._setEmptyValue();
      } else {
        let dateToSet = this._getDateToSet(dateFromPicker);
        if (!this.get('hasTimePicker')) {
          dateToSet.setHours(13);
          dateToSet.setUTCHours(11);
          dateToSet.setUTCMinutes(0);
          dateToSet.setUTCSeconds(0);
          dateToSet.setUTCMilliseconds(0);
        }

        let currentValue = this.get('value');

        // TODO: refactor
        let tmp = moment(dateToSet).format(this.dateTimeFormat);
        let tmp2 = !moment(tmp, this.dateTimeFormat).isSame(moment(moment(currentValue).format(this.dateTimeFormat), this.dateTimeFormat));
        if (currentValue === null || tmp2) {
          this.set('value', dateToSet);
          this._setProperOffsetToCalendar();
        }

        this._setCalendarEnabledState();
      }
    });
  },

  /**
    Set empty value.

    @method _setEmptyValue
    @private
  */
  _setEmptyValue() {
    let currentValue = this.get('value');
    if (currentValue !== null) {
      this.set('value', null);
      this._setProperOffsetToCalendar();
    }
  },

  /**
    Change state of calendar.

    @example
      ```javascript
      getDateToSet: function(dateFromPicker) {
        if (!dateFromPicker.isValid()) {
          return this.invalidDate;
        }

        let minDate = this.get('minDate');
        let maxDate = this.get('maxDate');
        if (moment.isDate(minDate) && dateFromPicker.isBefore(this.minDate) ||
            moment.isDate(maxDate) && dateFromPicker.isAfter(this.maxDate)) {
            return this.invalidDate;
        }
      }
      ```

    @method _setCalendarEnabledState
    @private
  */
  _setCalendarEnabledState() {
    let dateToSet = this._getDateToSet(this.$('input').data('daterangepicker').endDate);
    if ((!dateToSet || dateToSet === this.invalidDate) && this.hasTimePicker) {
      this.$().parents('body').find('button.applyBtn').attr('disabled', 'disabled');
      this.$('input').data('daterangepicker').startDate = moment.invalid();
    } else {
      this.$().parents('body').find('button.applyBtn').removeAttr('disabled');
    }
  },

  /**
    Waiting for end of validation and displaying errors if model is not valid.

    @method _setProperOffsetToCalendar
    @private
  */
  _setProperOffsetToCalendar() {
    let _this = this;
    setTimeout(function() { _this.$('input').data('daterangepicker').move(); }, 500);
  },

  /**
    Set proper start date when value changed outside of component.

    @method _valueChanged
    @private
  */
  _valueChanged: observer('value', function() {
    let val = this.get('value');
    let currValueDateTime = moment(this._getDateToSet(moment(val)));
    if (val && moment.isDate(val) && currValueDateTime.isValid()) {
      let currInputDateTime = moment(moment(this.$('input').val(), this.dateTimeFormat).toDate());

      // Change current date and time when changes were made outside of input element.
      if (!currValueDateTime.isSame(currInputDateTime)) {
        if (this.$('input').data('daterangepicker') !== undefined) {
          this.$('input').data('daterangepicker').startDate = currValueDateTime;
          this.$('input').data('daterangepicker').setEndDate(currValueDateTime);
        } else {
          this.$('input').val(currValueDateTime.format(this.dateTimeFormat));
        }
      }
    } else if (val === null) {
      let valueFromInput = this.$('input').val();
      if (valueFromInput !== '') {
        this.$('input').val('');
      }
    } else if (!currValueDateTime.isValid()) {
      if (val !== this.invalidDate) {
        this.set('value', this.invalidDate);
        this.$('input').val(currValueDateTime.format(this.dateTimeFormat));
      }
    } else if (!moment.isDate(val)) {
      this.set('value', currValueDateTime.toDate());
    }
  }),
});
