import Ember from 'ember';
import { translationMacro as t } from 'ember-i18n';

export default Ember.Controller.extend({
  /**
    Text for 'flexberry-field' component 'label' property.

    @property label
    @type String
   */
  label: undefined,

  /**
    Text for 'flexberry-field' component 'placeholder' property.

    @property placeholder
    @type String
   */
  placeholder: t('components.flexberry-field.placeholder'),
  /**
    Handles changes in placeholder.

    @method _placeholderChanged
    @private
   */
  _placeholderChanged: Ember.observer('placeholder', function() {
    if (this.get('placeholder') === this.get('i18n').t('components.flexberry-field.placeholder').toString()) {
      this.set('placeholder', t('components.flexberry-field.placeholder'));
    }
  }),
  /**
    Flag: indicates whether 'flexberry-field' component is in 'readonly' mode or not.

    @property readonly
    @type Boolean
   */
  readonly: false,

  /**
    Type of 'flexberry-field' component.

    @property type
    @type String
   */
  type: 'text',

  /**
    Template text for 'flexberry-field' component.

    @property componentTemplateText
    @type String
   */
  componentTemplateText: new Ember.Handlebars.SafeString(
    '{{flexberry-field<br>' +
    '  value=model.text<br>' +
    '  label=label<br>' +
    '  placeholder=placeholder<br>' +
    '  readonly=readonly<br>' +
    '  type=type<br>' +
    '}}'),

  /**
    Component settings metadata.

    @property componentSettingsMetadata
    @type Object[]
   */
  componentSettingsMetadata: Ember.computed('i18n.locale', function() {
    var componentSettingsMetadata = Ember.A();
    componentSettingsMetadata.pushObject({
      settingName: 'type',
      settingType: 'enumeration',
      settingDefaultValue: 'text',
      settingAvailableItems: ['text', 'number', 'password', 'color', 'button', 'hidden'],
      bindedControllerPropertieName: 'type'
    });
    componentSettingsMetadata.pushObject({
      settingName: 'value',
      settingType: 'string',
      settingDefaultValue: undefined,
      bindedControllerPropertieName: 'model.text'
    });
    componentSettingsMetadata.pushObject({
      settingName: 'label',
      settingType: 'string',
      settingDefaultValue: undefined,
      bindedControllerPropertieName: 'label'
    });
    componentSettingsMetadata.pushObject({
      settingName: 'placeholder',
      settingType: 'string',
      settingDefaultValue: this.get('i18n').t('components.flexberry-field.placeholder'),
      bindedControllerPropertieName: 'placeholder'
    });
    componentSettingsMetadata.pushObject({
      settingName: 'readonly',
      settingType: 'boolean',
      settingDefaultValue: false,
      bindedControllerPropertieName: 'readonly'
    });

    return componentSettingsMetadata;
  })
});
