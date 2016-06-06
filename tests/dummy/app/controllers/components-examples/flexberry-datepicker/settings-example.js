import Ember from 'ember';
import { translationMacro as t } from 'ember-i18n';

export default Ember.Controller.extend({
  /**
    Default display format.

    @property dateTimeFormat
    @type string
   */
  dateTimeFormat: 'DD.MM.YYYY',
  /**
    Flag: show time in control and time picker inside date picker.

    @property hasTimePicker
    @type boolean
   */
  hasTimePicker: false,
  /**
    The earliest date a user may select.

    @property minDate
    @type date
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
    '..dateTimeFormat=dateTimeFormat<br>' +
    '..hasTimePicker=hasTimePicker<br>' +
    '..minDate=minDate<br>' +
    '..maxDate=maxDate<br>' +
    '..value=model.date<br>' +
    '..placeholder=placeholder<br>' +
    '..readonly=readonly<br>' +
    '}}'),

  /**
    Component settings metadata.

    @property componentSettingsMetadata
    @type Object[]
   */
  componentSettingsMetadata: Ember.computed('i18n.locale', function() {
    var componentSettingsMetadata = Ember.A();
    componentSettingsMetadata.pushObject({
      settingName: 'dateTimeFormat',
      settingType: 'string',
      settingDefaultValue: 'DD.MM.YYYY',
      bindedControllerPropertieName: 'dateTimeFormat'
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
      settingDefaultValue: 'undefined',
      bindedControllerPropertieName: 'minDate'
    });
    componentSettingsMetadata.pushObject({
      settingName: 'maxDate',
      settingType: 'date',
      settingDefaultValue: 'undefined',
      bindedControllerPropertieName: 'maxDate'
    });
    componentSettingsMetadata.pushObject({
      settingName: 'value',
      settingType: 'date',
      settingDefaultValue: 'undefined',
      bindedControllerPropertieName: 'model.date'
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
