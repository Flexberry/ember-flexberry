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
  title: 'Temp title',

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
    Flag indicates whether 'flexberry-lookup' component use user settings or not.

    @property removeButtonClass
    @type String
    @default 'olive'
  */
  notUseUserSettings: false,
});
