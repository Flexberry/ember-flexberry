/* global moment:true */
import Ember from 'ember';

// DateTime picker component for Semantic UI (Semantic UI hasn't its own DateTime picker component yet).
export default Ember.Component.extend({
  // String with input css classes.
  classes: undefined,

  // Flag to make control readonly.
  readonly: false,

  // Flag to make control required.
  required: false,

  // Flag to show time in control and time picker inside date picker.
  hasTimePicker: false,

  // Input value.
  value: undefined,

  _initializeComponent: function() {
    var hasTimePicker = this.get('hasTimePicker');
    var dateTimeFormat = hasTimePicker ? 'DD.MM.YYYY HH:mm:ss' : 'DD.MM.YYYY';
    var val = this.get('value');
    var startDate = new Date();
    if (val !== undefined && moment(val).isValid()) {
      startDate = moment(val);
      this.set('value', moment(val).format(dateTimeFormat));
    }

    var readonly = this.get('readonly');
    if (!readonly) {
      this.$('input').daterangepicker({
        startDate: startDate,
        singleDatePicker: true,
        timePicker: hasTimePicker,
        timePickerIncrement: 1,
        timePicker12Hour: false,
        timePickerSeconds: true,
        format: dateTimeFormat
      });
    }
  }.on('didInsertElement')
});
