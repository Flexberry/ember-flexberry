/* global moment:true */
import Ember from 'ember';
import BaseComponent from './base';

// DateTime picker component for Semantic UI (Semantic UI hasn't its own DateTime picker component yet).
export default BaseComponent.extend({
  // String with input css classes.
  classes: undefined,

  // Flag to make control required.
  required: false,

  // Flag to show time in control and time picker inside date picker.
  hasTimePicker: false,

  // Type of input element for render.
  type: 'text',

  // Input value.
  value: undefined,

  // Invalid date for set to model value when needed.
  invalidDate: new Date('invalid'),

  // Default display format.
  dateTimeFormat: 'DD.MM.YYYY',

  // The earliest date a user may select.
  minDate: undefined,

  // The latest date a user may select.
  maxDate: undefined,

  // Init component when DOM is ready.
  didInsertElement: function() {
    this.minDate = this.minDate === undefined ? moment('01.01.1900', this.dateTimeFormat) : moment(this.minDate, this.dateTimeFormat);
    this.maxDate = this.maxDate === undefined ? moment('31.12.9999', this.dateTimeFormat) : moment(this.maxDate, this.dateTimeFormat);

    var hasTimePicker = this.get('hasTimePicker');
    if (hasTimePicker) {
      this.dateTimeFormat = 'DD.MM.YYYY HH:mm:ss';
    }

    var val = this.get('value');
    var startDate = moment(new Date());
    if (val !== undefined && moment(val).isValid()) {
      startDate = moment(val);
      this.$('input').val(startDate.format(this.dateTimeFormat));
    }

    var readonly = this.get('readonly');
    var _this = this;
    if (readonly === undefined) {
      this.$('input').daterangepicker(
      {
        startDate: startDate,
        singleDatePicker: true,
        showDropdowns: true,
        timePicker: hasTimePicker,
        timePickerIncrement: 1,
        timePicker12Hour: false,
        timePickerSeconds: true,
        minDate: this.minDate,
        maxDate: this.maxDate,
        format: this.dateTimeFormat
      },
      function(start, end, label) {
        _this.setValue(end);
      }
      );
      this.$('input').on('apply.daterangepicker', function(ev, picker) {
        var currentValue = _this.get('value');
        var pickerDateString = moment(picker.endDate.toDate()).format(_this.dateTimeFormat);
        if (!currentValue || !moment(moment(currentValue).format(_this.dateTimeFormat), _this.dateTimeFormat).isSame(moment(pickerDateString, _this.dateTimeFormat))) {
          _this.setValue(picker.endDate);
        }
      });
      this.$('input').on('cancel.daterangepicker', function(ev, picker) {
        var currentInputValueString = _this.$('input').val();
        var pickerDateString = picker.endDate.format(_this.dateTimeFormat);
        if (!moment(moment(currentInputValueString, _this.dateTimeFormat).format(_this.dateTimeFormat), _this.dateTimeFormat).isSame(moment(pickerDateString, _this.dateTimeFormat))) {
          var oldPickerDateString = picker.endDate._i;
          if (typeof (oldPickerDateString) === 'string' && currentInputValueString !== oldPickerDateString) {
            _this.$('input').val(oldPickerDateString);
          }

          var currentValue = _this.get('value');
          if (!moment(moment(currentValue).format(_this.dateTimeFormat), _this.dateTimeFormat).isSame(moment(pickerDateString, _this.dateTimeFormat))) {
            _this.setValue(picker.endDate);
          }
        }
      });
      this.$('input').on('show.daterangepicker', function(ev, picker) {
        if (!picker.endDate.isValid()) {
          _this.$('input').data('daterangepicker').startDate = moment.invalid();
        }

        _this.setCalendarEnabledState();
      });
      this.$('input').keyup(function() {
        var valueFromInput = _this.$(this).val();
        _this.setValue(moment(valueFromInput, _this.dateTimeFormat));
      });
    }
  },

  setValue: function(dateFromPicker) {
    var valueFromInput = this.$('input').val();
    if (valueFromInput === '' && !dateFromPicker.isValid()) {
      this.setEmptyValue();
    }
    else {
      var dateToSet = this.getDateToSet(dateFromPicker);
      var currentValue = this.get('value');
      if (currentValue === null || !moment(moment(dateToSet).format(this.dateTimeFormat), this.dateTimeFormat).isSame(moment(moment(currentValue).format(this.dateTimeFormat), this.dateTimeFormat))) {
        this.set('value', dateToSet);
        this.setProperOffsetToCalendar();
      }
    }

    this.setCalendarEnabledState();
  },

  setEmptyValue: function() {
    var currentValue = this.get('value');
    if (currentValue !== null) {
      this.set('value', null);
      this.setProperOffsetToCalendar();
    }
  },

  getDateToSet: function(dateFromPicker) {
    if (!dateFromPicker.isValid()) {
      return this.invalidDate;
    }

    if (dateFromPicker.isBefore(this.minDate) || dateFromPicker.isAfter(this.maxDate)) {
      return this.invalidDate;
    }

    return dateFromPicker.toDate();
  },

  setCalendarEnabledState: function() {
    var dateToSet = this.getDateToSet(this.$('input').data('daterangepicker').endDate);
    if ((!dateToSet || dateToSet === this.invalidDate) && this.hasTimePicker) {
      this.$().parents('body').find('button.applyBtn').attr('disabled', 'disabled');
      this.$('input').data('daterangepicker').startDate = moment.invalid();
    }
    else {
      this.$().parents('body').find('button.applyBtn').removeAttr('disabled');
    }
  },

  setProperOffsetToCalendar: function() {
    //Waiting for end of validation and displaying errors if model is not valid
    var _this = this;
    setTimeout(function() { _this.$('input').data('daterangepicker').move(); }, 500);
  },

  // Set proper start date when value changed outside of component.
  valueChanged: Ember.observer('value', function() {
    var val = this.get('value');
    var currValueDateTime = moment(this.getDateToSet(moment(val)));
    if (val && moment.isDate(val) && currValueDateTime.isValid()) {
      var currInputDateTime = moment(moment(this.$('input').val(), this.dateTimeFormat).toDate());

      // Change current date and time when changes were made outside of input element.
      if (!currValueDateTime.isSame(currInputDateTime)) {
        if (this.$('input').data('daterangepicker') !== undefined) {
          this.$('input').data('daterangepicker').startDate = currValueDateTime;
          this.$('input').data('daterangepicker').setEndDate(currValueDateTime);
        }
        else {
          this.$('input').val(currValueDateTime.format(this.dateTimeFormat));
        }
      }
    }
    else if (val === null) {
      var valueFromInput = this.$('input').val();
      if (valueFromInput !== '') {
        this.$('input').val('');
      }
    }
    else if (!currValueDateTime.isValid()) {
      if (val !== this.invalidDate) {
        this.set('value', this.invalidDate);
        this.$('input').val(currValueDateTime.format(this.dateTimeFormat));
      }
    }
    else if (!moment.isDate(val)) {
      this.set('value', currValueDateTime.toDate());
    }
  })
});
