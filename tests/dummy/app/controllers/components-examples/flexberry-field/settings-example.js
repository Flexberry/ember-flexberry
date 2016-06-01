import Ember from 'ember';

export default Ember.Controller.extend({
  /**
    Label for 'flexberry-field' component 'label' property.

    @property label
    @type String
   */
  label: undefined,

  /**
    Placeholder for 'flexberry-field' component 'placeholder' property.

    @property placeholder
    @type String
   */
  placeholder: undefined,

  /**
    Flag: indicates whether 'flexberry-field' component is in 'readonly' mode or not.

    @property readonly
    @type Boolean
   */
  readonly: false,

  /**
    Template text for 'flexberry-field' component.

    @property componentTemplateText
    @type String
   */
  componentTemplateText: new Ember.Handlebars.SafeString(
    '{{flexberry-field<br>' +
    '..value=model.text<br>' +
    '..label=label<br>' +
    '..placeholder=placeholder<br>' +
    '..readonly=readonly<br>' +
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
      settingType: 'string',
      settingDefaultValue: 'undefined',
      bindedControllerPropertieName: 'model.text'
    });
    componentSettingsMetadata.pushObject({
      settingName: 'label',
      settingType: 'string',
      settingDefaultValue: 'undefined',
      bindedControllerPropertieName: 'label'
    });
    componentSettingsMetadata.pushObject({
      settingName: 'placeholder',
      settingType: 'string',
      settingDefaultValue: 'undefined',
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
