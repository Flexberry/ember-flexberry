import Ember from 'ember';
import Enumeration from '../../../enums/components-examples/flexberry-dropdown/settings-example/enumeration';
import { enumCaptions } from 'ember-flexberry/utils/enum-functions';
import { translationMacro as t } from 'ember-i18n';

export default Ember.Controller.extend({
  /**
    Text for 'flexberry-dropdown' component 'placeholder' property.

    @property placeholder
    @type String
   */
  placeholder: t('components.flexberry-dropdown.placeholder'),

  /**
    Flag: indicates whether 'flexberry-dropdown' component is in 'readonly' mode or not.

    @property readonly
    @type Boolean
   */
  readonly: false,

  /**
    Template text for 'flexberry-dropdown' component.

    @property componentTemplateText
    @type String
   */
  componentTemplateText: new Ember.Handlebars.SafeString(
    '{{flexberry-dropdown<br>' +
    '  items=(enum-captions \"components-examples/flexberry-dropdown/settings-example/enumeration\")<br>' +
    '  value=model.enumeration<br>' +
    '  placeholder=placeholder<br>' +
    '  readonly=readonly<br>' +
    '}}'),

  /**
    Component settings metadata.

    @property componentSettingsMetadata
    @type Object[]
   */
  componentSettingsMetadata: Ember.computed('i18n.locale', function() {
    var componentSettingsMetadata = Ember.A();
    componentSettingsMetadata.pushObject({
      settingName: 'value',
      settingType: 'enumeration',
      settingAvailableItems: enumCaptions(Enumeration),
      settingDefaultValue: undefined,
      bindedControllerPropertieName: 'model.enumeration'
    });
    componentSettingsMetadata.pushObject({
      settingName: 'placeholder',
      settingType: 'string',
      settingDefaultValue: this.get('i18n').t('components.flexberry-dropdown.placeholder'),
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
