import Ember from 'ember';

export default Ember.Controller.extend({
  /**
    Label for 'flexberry-simpledatetime' component 'label' property.

    @property label
    @type String
   */
  label: undefined,

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
    '..value=model.simpledate<br>' +
    '..readonly=readonlyAttr<br>' +
    '..min=minStr<br>' +
    '..max=maxStr<br>' +
    '}}'),

  /**
    Component settings metadata.

    @property componentSettingsMetadata
    @type Object[]
   */
  componentSettingsMetadata: Ember.computed(function() {
    var componentSettingsMetadata = Ember.A();
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
      bindedControllerPropertieName: 'readonlyAttr'
    });
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

    return componentSettingsMetadata;
  })
});
