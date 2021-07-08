import { observer } from '@ember/object';
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
});
