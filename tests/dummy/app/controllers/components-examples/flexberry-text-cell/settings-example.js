import Ember from 'ember';

export default Ember.Controller.extend({
  /**
    'flexberry-text-cell' component's 'value' property.

    @property value
    @type String
  */
  value: 'test string',

  /**
    'flexberry-text-cell' component's 'maxTextLength' property.

    @property maxTextLength
    @type Number
  */
  maxTextLength: 7,

  /**
    Flag for 'flexberry-text-cell' component 'cutBySpaces' property.

    @property cutBySpaces
    @type Boolean
  */
  cutBySpaces: false,

  /**
    Template text for 'flexberry-textarea' component.

    @property componentTemplateText
    @type String
   */
  componentTemplateText: new Ember.Handlebars.SafeString(
    '{{flexberry-text-cell<br>' +
    '  value=value<br>' +
    '  maxTextLength=maxTextLength<br>' +
    '  cutBySpaces=cutBySpaces<br>' +
    '}}'),

  /**
    Component settings metadata.

    @property componentSettingsMetadata
    @type Object[]
  */
  componentSettingsMetadata: Ember.computed('i18n.locale', 'model.content', function() {
    let componentSettingsMetadata = Ember.A();
    componentSettingsMetadata.pushObject({
      settingName: 'value',
      settingType: 'string',
      settingDefaultValue: 'test string',
      bindedControllerPropertieName: 'value'
    });
    componentSettingsMetadata.pushObject({
      settingName: 'maxTextLength',
      settingType: 'number',
      settingDefaultValue: 7,
      bindedControllerPropertieName: 'maxTextLength'
    });
    componentSettingsMetadata.pushObject({
      settingName: 'cutBySpaces',
      settingType: 'boolean',
      settingDefaultValue: false,
      bindedControllerPropertieName: 'cutBySpaces'
    });
    return componentSettingsMetadata;
  }),
});
