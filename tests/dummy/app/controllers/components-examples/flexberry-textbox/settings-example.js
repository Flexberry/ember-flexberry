import Ember from 'ember';

export default Ember.Controller.extend({
  /**
    Placeholder for 'flexberry-textbox' component 'placeholder' property.

    @property placeholder
    @type String
   */
  placeholder: undefined,

  /**
    Flag: indicates whether 'flexberry-checkbox' component is in 'readonly' mode or not.

    @property readonly
    @type Boolean
   */
  readonly: false,

  /**
    Template text for 'flexberry-checkbox' component.

    @property componentTemplateText
    @type String
   */
  componentTemplateText: new Ember.Handlebars.SafeString(
    '{{flexberry-textbox<br>' +
    '..value=model.text<br>' +
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
