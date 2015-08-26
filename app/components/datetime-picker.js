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

  // Type of input element for render.
  type: 'text',

  // Input value.
  value: undefined,

  // Invalid date for set to model value when needed.
  invalidDate: new Date('invalid'),

  // Default display format.
  dateTimeFormat: 'DD.MM.YYYY',

  // Init component when DOM is ready.
  _initializeComponent: function() {
    var hasTimePicker = this.get('hasTimePicker');
    if (hasTimePicker) {
      this.dateTimeFormat = 'DD.MM.YYYY HH:mm:ss';
    }

    var val = this.get('value');
    var startDate = new Date();
    if (val !== undefined && moment(val).isValid()) {
      startDate = moment(val);
      this.$('input').val(startDate.format(this.dateTimeFormat));
    }

    var readonly = this.get('readonly');
    var _this = this;
    if (!readonly) {
      this.$('input').daterangepicker(
      {
        startDate: startDate,
        singleDatePicker: true,
        showDropdowns: true,
        timePicker: hasTimePicker,
        timePickerIncrement: 1,
        timePicker12Hour: false,
        timePickerSeconds: true,
        format: this.dateTimeFormat
      },
      function(start, end, label) {
        var dateToSet = start.isValid() ? start.toDate() : _this.invalidDate;
        _this.set('value', dateToSet);
      }
      );
    }
  }.on('didInsertElement'),

  // Set proper start date when value changed outside of component.
  _valueChanged: function() {
    var val = this.get('value');
    var currValueDateTime = moment(val);
    if (currValueDateTime.isValid()) {
      var currInputDateTime = moment(this.$('input').val(), this.dateTimeFormat);

      // Change current date and time in datetimepicker when changes were made outside of input element.
      if (!currValueDateTime.isSame(currInputDateTime)) {
        this.$('input').data('daterangepicker').setEndDate(currValueDateTime);
      }
    }
  }.observes('value')
});
