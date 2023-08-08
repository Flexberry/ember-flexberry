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
    Name for 'flexberry-lookup' component 'componentName' property.

    @property componentName
    @type String
    @default 'flexberry-lookup'
  */
  componentName: 'flexberry-lookup',

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
    @default 't('components.flexberry-lookup.choose-button-text')'
  */
  chooseText: t('components.flexberry-lookup.choose-button-text'),

  /**
    Content for 'flexberry-lookup' component 'removeText' property.

    @property removeText
    @type String
    @default t('components.flexberry-lookup.remove-button-text')
  */
  removeText: t('components.flexberry-lookup.remove-button-text'),

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
    Projection name for 'flexberry-lookup' component 'projection' property.

    @property projection
    @type String
    @default 'SettingLookupExampleView'
  */
  projection: 'SettingLookupExampleView',

  /**
    Attribute name name for 'flexberry-lookup' component 'displayAttributeName' property.

    @property projection
    @type String
    @default 'name'
  */
  displayAttributeName: 'name',

  /**
    Name for 'flexberry-lookup' component 'relationName' property.

    @property relationName
    @type String
    @default 'type'
  */
  relationName: 'type',

  /**
    Property for updateLookupValue action test.

    @property updateLookupValueTest
    @type String
    @default 'base'
  */
  updateLookupValueTest: 'base',

  actions: {
    updateLookupValue() {
      this._super(...arguments);
      this.set('updateLookupValueTest', 'updated');
    }
  }
});
