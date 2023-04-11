import Controller from '@ember/controller';
import { computed } from '@ember/object';
import { A } from '@ember/array';
import { htmlSafe } from '@ember/string';

export default Controller.extend({
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
  componentTemplateText: undefined,

  init() {
    this._super(...arguments);
    this.set('componentTemplateText', new htmlSafe(
      '{{flexberry-text-cell<br>' +
      '  value=value<br>' +
      '  maxTextLength=maxTextLength<br>' +
      '  cutBySpaces=cutBySpaces<br>' +
      '}}'));
  },

  /**
    Component settings metadata.

    @property componentSettingsMetadata
    @type Object[]
  */
  componentSettingsMetadata: computed('i18n.locale', 'model.content', function() {
    let componentSettingsMetadata = A();
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
