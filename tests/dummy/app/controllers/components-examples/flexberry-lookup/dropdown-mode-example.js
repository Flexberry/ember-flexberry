import { computed } from '@ember/object';
import EditFormController from 'ember-flexberry/controllers/edit-form';
import { StringPredicate } from 'ember-flexberry-data/query/predicate';
import { translationMacro as t } from 'ember-i18n';


export default EditFormController.extend({
  /**
    Current predicate to limit accessible values for lookup in dropdown mode.

    @property lookupCustomLimitPredicate
    @type StringPredicate
  */
  lookupCustomLimitPredicate: computed(function() {
    return new StringPredicate('name').contains('Type');
  }),

  rerender: true,

  minCharactersValue: 0,

  /**
    Minimum characters for autocomplete search.

    @property minCharacters
    @type Number
  */
  minCharacters: computed('minCharactersValue', function() {
    return parseInt(this.get('minCharactersValue'));
  }),

  /**
    Text for 'flexberry-field' component 'label' property.

    @property label
    @type String
  */
  label: t('forms.components-examples.flexberry-lookup.dropdown-mode-example.fieldMinCharacters'),

  /**
    Text for 'flexberry-field' component 'placeholder' property.

    @property placeholder
    @type String
  */
  placeholder: t('components.flexberry-field.placeholder'),

  /**
    Type of 'flexberry-field' component.

    @property type
    @type String
  */
  type: 'number'
});
