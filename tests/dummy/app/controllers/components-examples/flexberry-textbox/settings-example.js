import Controller from '@ember/controller';
import { computed, observer } from '@ember/object';
import { A } from '@ember/array';
import { htmlSafe } from '@ember/string';
import { translationMacro as t } from 'ember-i18n';

export default Controller.extend({
  /**
    Text for 'flexberry-textbox' component 'placeholder' property.

    @property placeholder
    @type String
   */
  placeholder: t('components.flexberry-textbox.placeholder'),
  /**
    Handles changes in placeholder.

    @method _placeholderChanged
    @private
   */
  _placeholderChanged: observer('placeholder', function() {
    if (this.get('placeholder') === this.get('i18n').t('components.flexberry-textbox.placeholder').toString()) {
      this.set('placeholder', t('components.flexberry-textbox.placeholder'));
    }
  }),
  /**
    Flag: indicates whether 'flexberry-textbox' component is in 'readonly' mode or not.

    @property readonly
    @type Boolean
   */
  readonly: false,

  /**
    Maxlength of 'flexberry-textbox' component.

    @property maxlength
    @type Number
   */
  maxlength: undefined,

  /**
    Template text for 'flexberry-textbox' component.

    @property componentTemplateText
    @type String
   */
  componentTemplateText: undefined,

  init() {
    this._super(...arguments);
    this.set('componentTemplateText', new htmlSafe(
      '{{flexberry-textbox<br>' +
      '  value=model.text<br>' +
      '  placeholder=placeholder<br>' +
      '  readonly=readonly<br>' +
      '  class=class<br>' +
      '  maxlength=maxlength<br>' +
      '}}'));
  },

  /**
    Component settings metadata.

    @property componentSettingsMetadata
    @type Object[]
   */
  componentSettingsMetadata: computed('i18n.locale', function() {
    let componentSettingsMetadata = A();
    componentSettingsMetadata.pushObject({
      settingName: 'value',
      settingType: 'string',
      settingDefaultValue: undefined,
      bindedControllerPropertieName: 'model.text'
    });
    componentSettingsMetadata.pushObject({
      settingName: 'placeholder',
      settingType: 'string',
      settingDefaultValue: this.get('i18n').t('components.flexberry-textbox.placeholder'),
      bindedControllerPropertieName: 'placeholder'
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
      settingAvailableItems: ['fluid input', 'transparent input', 'mini input', 'huge input', 'input error'],
      bindedControllerPropertieName: 'class'
    });
    componentSettingsMetadata.pushObject({
      settingName: 'maxlength',
      settingType: 'number',
      settingDefaultValue: undefined,
      bindedControllerPropertieName: 'maxlength'
    });

    return componentSettingsMetadata;
  })
});
