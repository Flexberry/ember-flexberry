import Ember from 'ember';
import EditFormController from 'ember-flexberry/controllers/edit-form';
import { Query } from 'ember-flexberry-data';

const { SimplePredicate, FilterOperator } = Query;

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
  lookupCustomLimitPredicate: Ember.computed('limitEnabled', function() {
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
  componentSettingsMetadata: Ember.computed('i18n.locale', function() {
    let componentSettingsMetadata = Ember.A();
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
