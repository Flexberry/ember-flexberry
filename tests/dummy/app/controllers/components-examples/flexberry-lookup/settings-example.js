import Ember from 'ember';
import EditFormController from 'ember-flexberry/controllers/edit-form';
import { translationMacro as t } from 'ember-i18n';

export default EditFormController.extend({
  /**
    Text for 'flexberry-lookup' component 'placeholder' property.

    @property placeholder
    @type String
    @default 't('components.flexberry-lookup.placeholder')'
   */
  placeholder: t('components.flexberry-lookup.placeholder'),
  /**
    Handles changes in placeholder.

    @method _placeholderChanged
    @private
   */
  _placeholderChanged: Ember.observer('placeholder', function() {
    if (this.get('placeholder') === this.get('i18n').t('components.flexberry-lookup.placeholder').toString()) {
      this.set('placeholder', t('components.flexberry-lookup.placeholder'));
    }
  }),
  /**
    Flag indicates whether 'flexberry-lookup' component is in 'readonly' mode or not.

    @property readonly
    @type Boolean
    @default false
  */
  readonly: false,

  /**
    Text for 'flexberry-lookup' component 'placeholder' property.

    @property title
    @type String
    @default 'Master'
  */
  title: 'Master',

  /**
    Flag indicates whether 'flexberry-lookup' component is in 'autocomplete' mode or not.

    @property autocomplete
    @type Boolean
    @default false
  */
  autocomplete: false,

  /**
    Flag indicates whether 'flexberry-lookup' component is in 'autocompletePersistValue' mode or not.

    @property autocompletePersistValue
    @type Boolean
    @default false
  */
  autocompletePersistValue: false,

  /**
    Flag indicates whether 'flexberry-lookup' component is in 'dropdown' mode or not.

    @property dropdown
    @type Boolean
    @default false
  */
  dropdown: false,

  /**
    Content for 'flexberry-lookup' component 'chooseText' property.

    @property chooseText
    @type String
    @default '<i class="remove icon"></i>'
  */
  chooseText: '<i class="change icon"></i>',

  /**
    Content for 'flexberry-lookup' component 'removeText' property.

    @property removeText
    @type String
    @default '<i class="remove icon"></i>'
  */
  removeText: '<i class="remove icon"></i>',

  /**
    Text for 'flexberry-lookup' component 'chooseButtonClass' property.

    @property chooseButtonClass
    @type String
    @default 'purple'
  */
  chooseButtonClass: '',

  /**
    Text for 'flexberry-lookup' component 'removeButtonClass' property.

    @property removeButtonClass
    @type String
    @default 'olive'
  */
  removeButtonClass: '',

  /**
    Template text for 'flexberry-lookup' component.

    @property componentTemplateText
    @type String
  */
  componentTemplateText: new Ember.Handlebars.SafeString(
    '{{flexberry-lookup<br>' +
    '  placeholder=placeholder<br>' +
    '  readonly=readonly<br>' +
    '  value=model.type<br>' +
    '  projection="SettingLookupExampleView"<br>' +
    '  displayAttributeName="name"<br>' +
    '  title="Master"<br>' +
    '  relatedModel=model<br>' +
    '  relationName="type"<br>' +
    '  choose="showLookupDialog"<br>' +
    '  remove="removeLookupValue"<br>' +
    '  autocomplete=autocomplete<br>' +
    '  autocompletePersistValue=autocompletePersistValue<br>' +
    '  displayValue=model.lookupDisplayValue<br>' +
    '  dropdown=dropdown<br>' +
    '  chooseText=chooseText<br>' +
    '  removeText=removeText<br>' +
    '  chooseButtonClass=chooseButtonClass<br>' +
    '  removeButtonClass=removeButtonClass<br>' +
    '}}'),

  /**
    Component settings metadata.

    @property componentSettingsMetadata
    @type Object[]
  */
  componentSettingsMetadata: Ember.computed('i18n.locale', function() {
    let componentSettingsMetadata = Ember.A();
    componentSettingsMetadata.pushObject({
      settingName: 'placeholder',
      settingType: 'string',
      settingDefaultValue: this.get('i18n').t('components.flexberry-lookup.placeholder'),
      bindedControllerPropertieName: 'placeholder'
    });
    componentSettingsMetadata.pushObject({
      settingName: 'readonly',
      settingType: 'boolean',
      settingDefaultValue: false,
      bindedControllerPropertieName: 'readonly'
    });
    componentSettingsMetadata.pushObject({
      settingName: 'title',
      settingType: 'string',
      settingDefaultValue: 'Master',
      bindedControllerPropertieName: 'title'
    });
    componentSettingsMetadata.pushObject({
      settingName: 'autocomplete',
      settingType: 'boolean',
      settingDefaultValue: false,
      bindedControllerPropertieName: 'autocomplete'
    });
    componentSettingsMetadata.pushObject({
      settingName: 'autocompletePersistValue',
      settingType: 'boolean',
      settingDefaultValue: false,
      bindedControllerPropertieName: 'autocompletePersistValue'
    });
    componentSettingsMetadata.pushObject({
      settingName: 'dropdown',
      settingType: 'boolean',
      settingDefaultValue: false,
      bindedControllerPropertieName: 'dropdown'
    });
    componentSettingsMetadata.pushObject({
      settingName: 'chooseText',
      settingType: 'string',
      settingDefaultValue: this.get('i18n').t('components.flexberry-lookup.choose-button-text'),
      bindedControllerPropertieName: 'chooseText'
    });
    componentSettingsMetadata.pushObject({
      settingName: 'removeText',
      settingType: 'string',
      settingDefaultValue: '<i class="remove icon"></i>',
      bindedControllerPropertieName: 'removeText'
    });
    componentSettingsMetadata.pushObject({
      settingName: 'chooseButtonClass',
      settingType: 'css',
      settingDefaultValue: '',
      settingAvailableItems: ['blue basic', 'positive', 'teal colored'],
      bindedControllerPropertieName: 'chooseButtonClass'
    });
    componentSettingsMetadata.pushObject({
      settingName: 'removeButtonClass',
      settingType: 'css',
      settingDefaultValue: '',
      settingAvailableItems: ['purple basic', 'negative', 'yellow colored'],
      bindedControllerPropertieName: 'removeButtonClass'
    });

    return componentSettingsMetadata;
  })
});
