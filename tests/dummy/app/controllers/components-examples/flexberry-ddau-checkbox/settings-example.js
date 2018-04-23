import Controller from '@ember/controller';
import { computed } from '@ember/object';
import { htmlSafe } from '@ember/string';
import { A } from '@ember/array';
import FlexberryDdauCheckboxActionsHandlerMixin from 'ember-flexberry/mixins/flexberry-ddau-checkbox-actions-handler';

export default Controller.extend(FlexberryDdauCheckboxActionsHandlerMixin, {
  /**
    Component's wrapper CSS classes.
    @property class
    @type String
  */
  class: '',

  /**
    Text for 'flexberry-ddau-checkbox' 'caption' property.

    @property caption
    @type String
    @default null
  */
  caption: null,

  /**
    Flag: indicates whether 'flexberry-ddau-checkbox' component is in 'readonly' mode or not.
    @property readonly
    @type Boolean
   */
  readonly: false,

  /**
    Template text for 'flexberry-ddau-checkbox' component.
    @property componentTemplateText
    @type String
   */
  componentTemplateText: undefined,

  /**
    Component settings metadata.
    @property componentSettingsMetadata
    @type Object[]
   */
  componentSettingsMetadata: computed('i18n.locale', function() {
    let componentSettingsMetadata = A();

    componentSettingsMetadata.pushObject({
      settingName: 'class',
      settingType: 'enumeration',
      settingAvailableItems: [
        'radio',
        'slider',
        'toggle'
      ],
      settingDefaultValue: '',
      bindedControllerPropertieName: 'class'
    });
    componentSettingsMetadata.pushObject({
      settingName: 'value',
      settingType: 'boolean',
      settingDefaultValue: undefined,
      bindedControllerPropertieName: 'model.flag'
    });
    componentSettingsMetadata.pushObject({
      settingName: 'caption',
      settingType: 'string',
      settingDefaultValue: null,
      bindedControllerPropertieName: 'caption'
    });
    componentSettingsMetadata.pushObject({
      settingName: 'readonly',
      settingType: 'boolean',
      settingDefaultValue: false,
      bindedControllerPropertieName: 'readonly'
    });

    return componentSettingsMetadata;
  }),

  init() {
    this._super(...arguments);
    this.set('componentTemplateText', new htmlSafe(
      '{{flexberry-ddau-checkbox<br>' +
      '  class=class<br>' +
      '  value=model.flag<br>' +
      '  caption=caption<br>' +
      '  readonly=readonly<br>' +
      '  change=(action "onCheckboxChange" "model.flag")<br>' +
      '}}'));
  }
});
