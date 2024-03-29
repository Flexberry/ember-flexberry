import { computed, observer } from '@ember/object';
import { A } from '@ember/array';
import { htmlSafe } from '@ember/string';
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
  _placeholderChanged: observer('placeholder', function() {
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
    Flag indicates whether 'flexberry-lookup' component  in 'dropdown' mode is search.

    @property dropdownIsSearch
    @type Boolean
    @default false
  */
  dropdownIsSearch: false,

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
    Text for 'flexberry-lookup' component 'dropdownClass' property.

    @property dropdownClass
    @type String
    @default 'blue'
  */
  dropdownClass: '',

  /**
    Text for 'flexberry-lookup' component 'removeButtonClass' property.

    @property removeButtonClass
    @type String
    @default 'olive'
  */
  removeButtonClass: '',

  /**
    Flag to show in lookup preview button.

    @property showPreviewButton
    @type Boolean
    @default false
  */
  showPreviewButton: false,

  /**
    Flag to show the selected object in separate route.

    @property previewOnSeparateRoute
    @type Boolean
    @default false
  */
  previewOnSeparateRoute: false,

  /**
    If `true`, page switching buttons will be available in the results for autocomplete.

    @property usePaginationForAutocomplete
    @type Boolean
    @default false
  */
  usePaginationForAutocomplete: false,

  /**
    Max number of the results for autocomplete.

    @property maxResults
    @type Integer
    @default 10
  */
  maxResults: 10,

  /**
    Template text for 'flexberry-lookup' component.

    @property componentTemplateText
    @type String
  */
  componentTemplateText: undefined,

  init() {
    this._super(...arguments);
    this.set('componentTemplateText', new htmlSafe(
      '{{flexberry-lookup<br>' +
      '  placeholder=placeholder<br>' +
      '  readonly=readonly<br>' +
      '  value=model.type<br>' +
      '  projection="SettingLookupExampleView"<br>' +
      '  displayAttributeName="name"<br>' +
      '  title="Master"<br>' +
      '  relatedModel=model<br>' +
      '  relationName="type"<br>' +
      '  choose=(action "showLookupDialog")<br>' +
      '  remove=(action "removeLookupValue")<br>' +
      '  autocomplete=autocomplete<br>' +
      '  autocompletePersistValue=autocompletePersistValue<br>' +
      '  autocompleteDirection=autocompleteDirection<br>' +
      '  usePaginationForAutocomplete=usePaginationForAutocomplete<br>' +
      '  maxResults=maxResults<br>' +
      '  displayValue=model.lookupDisplayValue<br>' +
      '  dropdown=dropdown<br>' +
      '  dropdownIsSearch=dropdownIsSearch<br>' +
      '  chooseText=chooseText<br>' +
      '  removeText=removeText<br>' +
      '  chooseButtonClass=chooseButtonClass<br>' +
      '  removeButtonClass=removeButtonClass<br>' +
      '  showPreviewButton=showPreviewButton<br>' +
      '  previewOnSeparateRoute=previewOnSeparateRoute<br>' +
      '  previewFormRoute="ember-flexberry-dummy-suggestion-type-edit"<br>' +
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
      settingName: 'usePaginationForAutocomplete',
      settingType: 'boolean',
      settingDefaultValue: false,
      bindedControllerPropertieName: 'usePaginationForAutocomplete'
    });
    componentSettingsMetadata.pushObject({
      settingName: 'autocompleteDirection',
      settingType: 'enumeration',
      settingDefaultValue: 'downward',
      settingAvailableItems: ['downward', 'upward', 'auto'],
      bindedControllerPropertieName: 'autocompleteDirection'
    });
    componentSettingsMetadata.pushObject({
      settingName: 'maxResults',
      settingType: 'number',
      settingDefaultValue: 10,
      bindedControllerPropertieName: 'maxResults'
    });
    componentSettingsMetadata.pushObject({
      settingName: 'dropdown',
      settingType: 'boolean',
      settingDefaultValue: false,
      bindedControllerPropertieName: 'dropdown'
    });
    componentSettingsMetadata.pushObject({
      settingName: 'dropdownIsSearch',
      settingType: 'boolean',
      settingDefaultValue: false,
      bindedControllerPropertieName: 'dropdownIsSearch'
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
    componentSettingsMetadata.pushObject({
      settingName: 'dropdownClass',
      settingType: 'css',
      settingDefaultValue: '',
      settingAvailableItems: ['blue'],
      bindedControllerPropertieName: 'dropdownClass'
    });
    componentSettingsMetadata.pushObject({
      settingName: 'showPreviewButton',
      settingType: 'boolean',
      settingDefaultValue: false,
      bindedControllerPropertieName: 'showPreviewButton'
    });
    componentSettingsMetadata.pushObject({
      settingName: 'previewOnSeparateRoute',
      settingType: 'boolean',
      settingDefaultValue: false,
      bindedControllerPropertieName: 'previewOnSeparateRoute'
    });
    return componentSettingsMetadata;
  })
});
