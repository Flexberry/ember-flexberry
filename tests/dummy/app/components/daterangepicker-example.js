import Ember from 'ember';
import layout from '../templates/components/daterangepicker-example';
import moment from 'moment';

export default Ember.Component.extend({
  layout,

  /**
    Type of input element for render.
    In @type not used Markdown, so that [HTMLAttribute](https://www.w3.org/TR/html5/forms.html#attr-input-type).

    @property type
    @type HTMLAttribute
    @default text
  */
  type: 'text',

  /**
    Default display format.

    @property dateTimeFormat
    @type String
    @default 'DD.MM.YYYY'
  */
  dateTimeFormat: 'DD.MM.YYYY',

  /**
    Init component when DOM is ready.
  */
  didInsertElement() {
    let val = this.get('value');
    let startDate = moment(new Date());
    if (val !== undefined && moment(val).isValid()) {
      startDate = moment(val);
      this.$('input').val(startDate.format(this.dateTimeFormat));
    }

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
        format: this.dateTimeFormat
      },
      function(start, end, label) {
        _this._setValue(end);
      });
      this.$('i').click(function() {
        _this.$('input').trigger('click');
      });
      this.$('input').on('apply.daterangepicker', function(ev, picker) {
        let currentValue = _this.get('value');
        let pickerDateString = moment(picker.endDate.toDate()).format(_this.dateTimeFormat);

        // TODO: refactor
        let tmp = !moment(moment(currentValue).format(_this.dateTimeFormat), _this.dateTimeFormat).isSame(moment(pickerDateString, _this.dateTimeFormat));
        if (!currentValue || tmp) {
          _this._setValue(picker.endDate);
        }
      });
      this.$('input').on('cancel.daterangepicker', function(ev, picker) {
        let currentInputValueString = _this.$('input').val();
        let pickerDateString = picker.endDate.format(_this.dateTimeFormat);

        // TODO: refactor
        let tmp = moment(currentInputValueString, _this.dateTimeFormat);
        let tmp2 = !moment(tmp.format(_this.dateTimeFormat), _this.dateTimeFormat).isSame(moment(pickerDateString, _this.dateTimeFormat));
        if (tmp2) {
          let oldPickerDateString = picker.endDate._i;
          if (typeof (oldPickerDateString) === 'string' && currentInputValueString !== oldPickerDateString) {
            _this.$('input').val(oldPickerDateString);
          }

          let currentValue = _this.get('value');
          if (!moment(moment(currentValue).format(_this.dateTimeFormat), _this.dateTimeFormat).isSame(moment(pickerDateString, _this.dateTimeFormat))) {
            _this._setValue(picker.endDate);
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
    let valueFromInput = this.$('input').val();
    if (valueFromInput === '' && !dateFromPicker.isValid()) {
      this._setEmptyValue();
    } else {
      let dateToSet = this._getDateToSet(dateFromPicker);
      let currentValue = this.get('value');

      // TODO: refactor
      let tmp = moment(dateToSet).format(this.dateTimeFormat);
      let tmp2 = !moment(tmp, this.dateTimeFormat).isSame(moment(moment(currentValue).format(this.dateTimeFormat), this.dateTimeFormat));
      if (currentValue === null || tmp2) {
        this.set('value', dateToSet);
        this._setProperOffsetToCalendar();
      }
    }

    this._setCalendarEnabledState();
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
  _valueChanged: Ember.observer('value', function() {
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

  /**
    Destroys DOM-related component's properties.
  */
  willDestroyElement() {
    this._super(...arguments);

    let dateRangePicker = this.$().data('daterangepicker');
    if (!Ember.isNone(dateRangePicker)) {
      dateRangePicker.remove();
    }
  }
});
