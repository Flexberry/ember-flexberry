import Ember from 'ember';
import { translationMacro as t } from 'ember-i18n';

export default Ember.Controller.extend({
  /**
    Serialized model date.

    @property _serializedModelDate
    @type String
    @private
   */
  _serializedModelDate: undefined,

  /**
    Serialized min date.

    @property _serializedMinDate
    @type String
    @private
   */
  _serializedMinDate: undefined,

  /**
    Serialized max date.

    @property _serializedMaxDate
    @type String
    @private
   */
  _serializedMaxDate: undefined,

  /**
    Handles changes in serialized model date.

    @method _serializedModelDateDidChange
    @private
   */
  _serializedModelDateDidChange: Ember.observer('_serializedModelDate', function() {
    Ember.run.once(this, '_changeDateProperty', '_serializedModelDate', 'model.date');
  }),

  /**
    Handles changes in min date.

    @method _serializedMinDateDidChange
    @private
   */
  _serializedMinDateDidChange: Ember.observer('_serializedMinDate', function() {
    Ember.run.once(this, '_changeDateProperty', '_serializedMinDate', 'minDate');
  }),

  /**
    Handles changes in serialized max date.

    @method _serializedMaxDateDidChange
    @private
   */
  _serializedMaxDateDidChange: Ember.observer('_serializedMaxDate', function() {
    Ember.run.once(this, '_changeDateProperty', '_serializedMaxDate', 'maxDate');
  }),

  /**
    Handles changes in model date.

    @method _modelDateDidChange
    @private
   */
  _modelDateDidChange: Ember.observer('model.date', function() {
    Ember.run.once(this, '_changeSerializedDateProperty', '_serializedModelDate', 'model.date');
  }),

  /**
    Handles changes in some of the serialized date properties.

    @method _changeDateProperty
    @param {String} serializedDatePropertyName Name of serialized date property.
    @param {Date} datePropertyName Name of date property which need to be parsed.
    @private
   */
  _changeDateProperty(serializedDatePropertyName, datePropertyName) {
    let serializedDate = this.get(serializedDatePropertyName);
    if (Ember.typeOf(serializedDate) === 'undefined') {
      return;
    }

    if (serializedDate === '') {
      this.set(datePropertyName, null);
      return;
    }

    let momentDate = this.get('moment').moment(serializedDate);
    if (momentDate.isValid()) {
      this.set(datePropertyName, momentDate.toDate());
    } else {
      this.set(datePropertyName, new Date('invalid'));
    }
  },

  /**
    Handles changes in some of the date properties.

    @method _changeSerializedDateProperty
    @param {String} serializedDatePropertyName Name of serialized date property which need to be changed.
    @param {Date} datePropertyName Name of date property which contains value.
    @private
   */
  _changeSerializedDateProperty(serializedDatePropertyName, datePropertyName) {
    let date = this.get(datePropertyName);
    if (date === null || Ember.typeOf(date) === 'undefined') {
      return;
    }

    let momentDate = this.get('moment').moment(date);
    if (momentDate.isValid()) {
      this.set(serializedDatePropertyName, momentDate.format('YYYY-MM-DDTHH:MM'));
    } else {
      this.set(serializedDatePropertyName, '' + new Date('invalid'));
    }
  },

  /**
    Possible date time formats.

    @property _dateTimeFormats
    @type String[]
   */
  _dateTimeFormats: [
    'DD.MM.YYYY',
    'DD-MM-YYYY',
    'HH.MM.SS',
    'HH-MM-SS',
    'DD.MM.YYYY HH.MM.SS',
    'DD-MM-YYYY HH-MM-SS'
  ],

  /**
    Default display format.

    @property dateTimeFormat
    @type String
   */
  dateTimeFormat: 'DD.MM.YYYY',
  /**
    Flag: show time in control and time picker inside date picker.

    @property hasTimePicker
    @type Boolean
   */
  hasTimePicker: false,
  /**
    The earliest date a user may select.

    @property minDate
    @type Date
   */
  minDate: undefined,
  /**
    The latest date a user may select.

    @property maxDate
    @type date
   */
  maxDate: undefined,
  /**
    Text for 'flexberry-datepicker' component 'placeholder' property.

    @property placeholder
    @type String
   */
  placeholder: t('components.flexberry-datepicker.placeholder'),
  /**
    Flag: indicates whether 'flexberry-datepicker' component is in 'readonly' mode or not.

    @property readonly
    @type Boolean
   */
  readonly: false,

  /**
    Template text for 'flexberry-datepicker' component.

    @property componentTemplateText
    @type String
   */
  componentTemplateText: new Ember.Handlebars.SafeString(
    '{{flexberry-datepicker<br>' +
    '  dateTimeFormat=dateTimeFormat<br>' +
    '  hasTimePicker=hasTimePicker<br>' +
    '  minDate=minDate<br>' +
    '  maxDate=maxDate<br>' +
    '  value=model.date<br>' +
    '  placeholder=placeholder<br>' +
    '  readonly=readonly<br>' +
    '}}'),

  /**
    Component settings metadata.

    @property componentSettingsMetadata
    @type Object[]
   */
  componentSettingsMetadata: Ember.computed('i18n.locale', function() {
    let componentSettingsMetadata = Ember.A();

    componentSettingsMetadata.pushObject({
      settingName: 'dateTimeFormat',
      settingType: 'enumeration',
      settingAvailableItems: this.get('_dateTimeFormats'),
      settingDefaultValue: null,
      bindedControllerPropertieName: 'dateTimeFormat',
      bindedControllerPropertieDisplayName: 'dateTimeFormat',
    });

    componentSettingsMetadata.pushObject({
      settingName: 'hasTimePicker',
      settingType: 'boolean',
      settingDefaultValue: 'false',
      bindedControllerPropertieName: 'hasTimePicker'
    });
    componentSettingsMetadata.pushObject({
      settingName: 'minDate',
      settingType: 'date',
      settingDefaultValue: undefined,
      bindedControllerPropertieName: '_serializedMinDate',
      bindedControllerPropertieDisplayName: 'minDate'
    });
    componentSettingsMetadata.pushObject({
      settingName: 'maxDate',
      settingType: 'date',
      settingDefaultValue: undefined,
      bindedControllerPropertieName: '_serializedMaxDate',
      bindedControllerPropertieDisplayName: 'maxDate'
    });
    componentSettingsMetadata.pushObject({
      settingName: 'value',
      settingType: 'date',
      settingDefaultValue: undefined,
      bindedControllerPropertieName: '_serializedModelDate',
      bindedControllerPropertieDisplayName: 'model.date'
    });
    componentSettingsMetadata.pushObject({
      settingName: 'placeholder',
      settingType: 'string',
      settingDefaultValue: this.get('i18n').t('components.flexberry-datepicker.placeholder'),
      bindedControllerPropertieName: 'placeholder'
    });
    componentSettingsMetadata.pushObject({
      settingName: 'readonly',
      settingType: 'boolean',
      settingDefaultValue: 'false',
      bindedControllerPropertieName: 'readonly'
    });

    return componentSettingsMetadata;
  })
});
