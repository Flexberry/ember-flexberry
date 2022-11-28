import Controller from '@ember/controller';
import { computed, observer } from '@ember/object';
import { A } from '@ember/array';
import { htmlSafe } from '@ember/string';
import { translationMacro as t } from 'ember-i18n';

export default Controller.extend({
  /**
    Text for 'flexberry-textarea' component 'placeholder' property.

    @property placeholder
    @type String
   */
  placeholder: t('components.flexberry-textarea.placeholder'),
  /**
    Handles changes in placeholder.

    @method _placeholderChanged
    @private
   */
  _placeholderChanged: observer('placeholder', function() {
    if (this.get('placeholder') === this.get('i18n').t('components.flexberry-textarea.placeholder').toString()) {
      this.set('placeholder', t('components.flexberry-textarea.placeholder'));
    }
  }),

  /**
    Possible selectionDirection values.

    @property _selectionDirections
    @type String[]
   */
  _selectionDirections: undefined,

  /**
    Possible wrap values.

    @property _wrapValues
    @type String[]
   */
  _wrapValues: undefined,

  /**
    Flag: indicates whether 'flexberry-textarea' component is in 'readonly' mode or not.

    @property readonly
    @type Boolean
    @default false
   */
  readonly: false,

  /**
    Flag: indicates whether 'flexberry-textarea' component is required for complete or not.

    @property required
    @type Boolean
    @default false
   */
  required: false,

  /**
    Flag: indicates whether 'flexberry-textarea' component is in 'disabled' mode or not.

    @property disabled
    @type Boolean
    @default false
   */
  disabled: false,

  /**
    Flag: indicates whether 'flexberry-textarea' component should be autofocused on page open or not.

    @property autofocus
    @type Boolean
    @default false
   */
  autofocus: false,

  /**
    Flag: indicates whether 'flexberry-textarea' component is in 'spellcheck' mode or not.

    @property spellcheck
    @type Boolean
    @default true
   */
  spellcheck: true,

  /**
    Number of columns for 'textarea' element.

    @property cols
    @type Number
    @default 20
   */
  cols: 20,

  /**
    Number of rows for 'textarea' element.

    @property rows
    @type Number
    @default 8
   */
  rows: 8,

  /**
    Wrap value for 'textarea' element.

    @property wrap
    @type String
    @default 'soft'
   */
  wrap: 'soft',

  /**
    Template text for 'flexberry-textarea' component.

    @property componentTemplateText
    @type String
   */
  componentTemplateText: undefined,

  init() {
    this._super(...arguments);
    this.set('_selectionDirections', [
      'forward',
      'backward',
      'none'
    ]);
    this.set('_wrapValues', [
      'soft',
      'hard',
      'off'
    ]);
    this.set('componentTemplateText', new htmlSafe(
      '{{textarea<br>' +
      '  value=model.text<br>' +
      '  placeholder=placeholder<br>' +
      '  readonly=readonly<br>' +
      '  class=class<br>' +
      '  required=required<br>' +
      '  rows=rows<br>' +
      '  cols=cols<br>' +
      '  disabled=disabled<br>' +
      '  maxlength=maxlength<br>' +
      '  selectionStart=selectionStart<br>' +
      '  selectionEnd=selectionEnd<br>' +
      '  selectionDirection=selectionDirection<br>' +
      '  wrap=wrap<br>' +
      '  autofocus=autofocus<br>' +
      '  spellcheck=spellcheck<br>' +
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
      settingDefaultValue: this.get('i18n').t('components.flexberry-textarea.placeholder'),
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
      settingAvailableItems: ['fluid input', 'mini input', 'huge input'],
      bindedControllerPropertieName: 'class'
    });
    componentSettingsMetadata.pushObject({
      settingName: 'required',
      settingType: 'boolean',
      settingDefaultValue: false,
      bindedControllerPropertieName: 'required'
    });
    componentSettingsMetadata.pushObject({
      settingName: 'rows',
      settingType: 'number',
      settingDefaultValue: 8,
      bindedControllerPropertieName: 'rows'
    });
    componentSettingsMetadata.pushObject({
      settingName: 'cols',
      settingType: 'number',
      settingDefaultValue: 20,
      bindedControllerPropertieName: 'cols'
    });
    componentSettingsMetadata.pushObject({
      settingName: 'disabled',
      settingType: 'boolean',
      settingDefaultValue: false,
      bindedControllerPropertieName: 'disabled'
    });
    componentSettingsMetadata.pushObject({
      settingName: 'maxlength',
      settingType: 'number',
      settingDefaultValue: undefined,
      bindedControllerPropertieName: 'maxlength'
    });
    componentSettingsMetadata.pushObject({
      settingName: 'selectionStart',
      settingType: 'number',
      settingDefaultValue: undefined,
      bindedControllerPropertieName: 'selectionStart'
    });
    componentSettingsMetadata.pushObject({
      settingName: 'selectionEnd',
      settingType: 'number',
      settingDefaultValue: undefined,
      bindedControllerPropertieName: 'selectionEnd'
    });
    componentSettingsMetadata.pushObject({
      settingName: 'selectionDirection',
      settingType: 'enumeration',
      settingAvailableItems: this.get('_selectionDirections'),
      settingDefaultValue: undefined,
      bindedControllerPropertieName: 'selectionDirection',
      bindedControllerPropertieDisplayName: 'selectionDirection',
    });
    componentSettingsMetadata.pushObject({
      settingName: 'wrap',
      settingType: 'enumeration',
      settingAvailableItems: this.get('_wrapValues'),
      settingDefaultValue: 'soft',
      bindedControllerPropertieName: 'wrap',
      bindedControllerPropertieDisplayName: 'wrap',
    });
    componentSettingsMetadata.pushObject({
      settingName: 'autofocus',
      settingType: 'boolean',
      settingDefaultValue: false,
      bindedControllerPropertieName: 'autofocus'
    });
    componentSettingsMetadata.pushObject({
      settingName: 'spellcheck',
      settingType: 'boolean',
      settingDefaultValue: true,
      bindedControllerPropertieName: 'spellcheck'
    });

    return componentSettingsMetadata;
  })
});
