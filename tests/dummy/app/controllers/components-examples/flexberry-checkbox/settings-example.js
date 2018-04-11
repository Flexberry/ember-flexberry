import Controller from '@ember/controller';
import { computed } from '@ember/object';
import { htmlSafe } from '@ember/string';
import { A } from '@ember/array';

export default Controller.extend({
  /**
    Text for 'flexberry-checkbox' component 'label' property.

    @property label
    @type String
   */
  label: undefined,

  /**
    Flag: indicates whether 'flexberry-checkbox' component is in 'readonly' mode or not.

    @property readonly
    @type Boolean
   */
  readonly: false,

  /**
    Component's wrapper CSS classes.

    @property class
    @type String
  */
  class: '',

  /**
    Template text for 'flexberry-checkbox' component.

    @property componentTemplateText
    @type String
   */
  componentTemplateText: new htmlSafe(
    '{{flexberry-checkbox<br>' +
    '  value=model.flag<br>' +
    '  label=label<br>' +
    '  readonly=readonly<br>' +
    '  class=class<br>' +
    '}}'),

  /**
    Component settings metadata.

    @property componentSettingsMetadata
    @type Object[]
   */
  componentSettingsMetadata: computed('i18n.locale', function() {
    var componentSettingsMetadata = A();
    componentSettingsMetadata.pushObject({
      settingName: 'value',
      settingType: 'boolean',
      settingDefaultValue: undefined,
      bindedControllerPropertieName: 'model.flag'
    });
    componentSettingsMetadata.pushObject({
      settingName: 'label',
      settingType: 'string',
      settingDefaultValue: undefined,
      bindedControllerPropertieName: 'label'
    });
    componentSettingsMetadata.pushObject({
      settingName: 'readonly',
      settingType: 'boolean',
      settingDefaultValue: false,
      bindedControllerPropertieName: 'readonly'
    });
    componentSettingsMetadata.pushObject({
      settingName: 'class',
      settingType: 'css',
      settingDefaultValue: '',
      settingAvailableItems: ['radio', 'slider', 'toggle'],
      bindedControllerPropertieName: 'class'
    });

    return componentSettingsMetadata;
  })
});
