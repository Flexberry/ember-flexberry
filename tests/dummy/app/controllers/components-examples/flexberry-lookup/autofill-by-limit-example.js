import { computed } from '@ember/object';
import { A } from '@ember/array';
import EditFormController from 'ember-flexberry/controllers/edit-form';
import { SimplePredicate } from 'ember-flexberry-data/query/predicate';
import FilterOperator from 'ember-flexberry-data/query/filter-operator';

export default EditFormController.extend({

  /**
    Current predicate to limit values for lookup.

    @property limitValue
    @type BasePredicate
    @default undefined
   */
  limitValue: undefined,

  /**
    Indicates when limit predicate is enabled.

    @property limitEnabled
    @type Boolean
    @default true
   */
  limitEnabled: true,

  /**
    Current readonly property value.

    @property readonly
    @type Boolean
    @default false
   */
  readonly: false,

  /**
    Current autofillByLimit property value.

    @property autofillByLimit
    @type Boolean
    @default true
   */
  autofillByLimit: true,

  /**
    Current predicate to limit accessible values for lookup.

    @property lookupCustomLimitPredicate
    @type BasePredicate
    @default undefined
   */
  lookupCustomLimitPredicate: computed('limitEnabled', function() {
    if (!this.get('limitEnabled')) {
      return undefined;
    }

    let limitValue = this.get('limitValue');

    return new SimplePredicate('id', FilterOperator.Eq, limitValue.get('id'));
  }),

  /**
    Component settings metadata.

    @property componentSettingsMetadata
    @type Object[]
  */
  componentSettingsMetadata: computed('i18n.locale', function() {
    let componentSettingsMetadata = A();
    componentSettingsMetadata.pushObject({
      settingName: 'autofillByLimit',
      settingType: 'boolean',
      settingDefaultValue: false,
      bindedControllerPropertieName: 'autofillByLimit'
    });
    componentSettingsMetadata.pushObject({
      settingName: 'limitEnabled',
      settingType: 'boolean',
      settingDefaultValue: true,
      bindedControllerPropertieName: 'limitEnabled'
    });
    componentSettingsMetadata.pushObject({
      settingName: 'readonly',
      settingType: 'boolean',
      settingDefaultValue: false,
      bindedControllerPropertieName: 'readonly'
    });

    return componentSettingsMetadata;
  })
});
