import Ember from 'ember';
import Enumeration from '../../../enums/components-examples/flexberry-dropdown/settings-example/enumeration';
import { translationMacro as t } from 'ember-i18n';

export default Ember.Controller.extend({
  /**
    Component's wrapper CSS classes.

    @property class
    @type String
  */
  class: '',

  /**
    Text for 'flexberry-dropdown' component 'placeholder' property.

    @property placeholder
    @type String
   */
  placeholder: t('components.flexberry-dropdown.placeholder'),

  /**
    Handles changes in placeholder.

    @method _placeholderChanged
    @private
   */
  _placeholderChanged: Ember.observer('placeholder', function() {
    if (this.get('placeholder') === this.get('i18n').t('components.flexberry-dropdown.placeholder').toString()) {
      this.set('placeholder', t('components.flexberry-dropdown.placeholder'));
    }
  }),

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
    '  items=(flexberry-enum \"components-examples/flexberry-dropdown/settings-example/enumeration\")<br>' +
    '  value=model.enumeration<br>' +
    '  placeholder=placeholder<br>' +
    '  readonly=readonly<br>' +
    '  class=class<br>' +
    '}}'),

  /**
    Component settings metadata.

    @property componentSettingsMetadata
    @type Object[]
   */
  componentSettingsMetadata: Ember.computed('i18n.locale', function() {
    let componentSettingsMetadata = Ember.A();
    let enumCaptions = Ember.A(Object.keys(Enumeration)).map((key) => { return Enumeration[key]; });

    componentSettingsMetadata.pushObject({
      settingName: 'value',
      settingType: 'enumeration',
      settingAvailableItems: enumCaptions,
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
    componentSettingsMetadata.pushObject({
      settingName: 'class',
      settingType: 'css',
      settingDefaultValue: '',
      settingAvailableItems: ['scrolling', 'compact', 'fluid'],
      bindedControllerPropertieName: 'class'
    });
    return componentSettingsMetadata;
  })
});
