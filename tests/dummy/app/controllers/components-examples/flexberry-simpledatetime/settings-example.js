import Ember from 'ember';

export default Ember.Controller.extend({
  /**
   Minimum value of this component.

   @property min
   @type Date
   */
  min: undefined,
  /**
    Maximum value of this component.

   @property max
   @type Date
   */
  max: undefined,

  /**
    Flag: indicates whether 'flexberry-simpledatetime' component is in 'readonly' mode or not.

    @property readonly
    @type Boolean
   */
  readonly: false,

  /**
    Template text for 'flexberry-simpledatetime' component.

    @property componentTemplateText
    @type String
   */
  componentTemplateText: new Ember.Handlebars.SafeString(
    '{{flexberry-simpledatetime<br>' +
    '..min=min<br>' +
    '..max=max<br>' +
    '..value=model.datetime<br>' +
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
      settingName: 'min',
      settingType: 'datetime',
      settingDefaultValue: 'undefined',
      bindedControllerPropertieName: 'min'
    });
    componentSettingsMetadata.pushObject({
      settingName: 'max',
      settingType: 'datetime',
      settingDefaultValue: 'undefined',
      bindedControllerPropertieName: 'max'
    });
    componentSettingsMetadata.pushObject({
      settingName: 'value',
      settingType: 'datetime',
      settingDefaultValue: 'undefined',
      bindedControllerPropertieName: 'model.datetime'
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
