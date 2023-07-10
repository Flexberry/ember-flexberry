import Controller from '@ember/controller';
import { computed } from '@ember/object';
import { A } from '@ember/array';
import { htmlSafe } from '@ember/string';

export default Controller.extend({
  /**
    Datetime picker type.

    @property type
    @type String
    @default 'datetime-local'
  */
  type: 'datetime-local',

  /**
    Enabled default date value.

    @property _value
    @type Boolean
    @default false
    @private
  */
  _value: false,

  /**
    Store real date value.

    @property __value
    @type Date
  */
  __value: undefined,

  /**
    Instead of `model.date` value.

    @property value
    @type Date
  */
  value: computed('_value', '__value', {
    get() {
      let value = this.get('__value');
      if (value === undefined) {
        return this.get('_value') ? new Date() : undefined;
      } else {
        return value;
      }
    },
    set(key, value) {
      if (typeof value === 'boolean') {
        return this.set('_value', value) ? new Date() : undefined;
      } else {
        return this.set('__value', value);
      }
    },
  }),

  /**
    Enabled min date value.

    @property _min
    @type Boolean
    @default true
    @private
  */
  _min: true,

  /**
    Minimum value of this component.

    @property min
    @type Date
    @default 'seven days under'
  */
  min: computed('_min', {
    get() {
      let min = new Date();
      min.setDate(min.getDate() - 7);
      return this.get('_min') ? min : null;
    },
    set(key, value) {
      let min = new Date();
      min.setDate(min.getDate() - 7);
      return this.set('_min', value) ? min : null;
    },
  }),

  /**
    Enabled max date value.

    @property _max
    @type Boolean
    @default true
    @private
  */
  _max: true,

  /**
    Maximum value of this component.

    @property max
    @type Date
    @default 'seven days older'
   */
  max: computed('_max', {
    get() {
      let max = new Date();
      max.setDate(max.getDate() + 7);
      return this.get('_max') ? max : null;
    },
    set(key, value) {
      let max = new Date();
      max.setDate(max.getDate() + 7);
      return this.set('_max', value) ? max : null;
    },
  }),

  /**
    Flag indicates whether 'flexberry-simpledatetime' component is in 'readonly' mode or not.

    @property readonly
    @type Boolean
   */
  readonly: false,

  /**
    Flag indicates whether 'flexberry-simpledatetime' component has remove button or not.

    @property removeButton
    @type Boolean
    @default true
   */
  removeButton: true,

  /**
    Template text for 'flexberry-simpledatetime' component.

    @property componentTemplateText
    @type String
   */
  componentTemplateText: undefined,

  init() {
    this._super(...arguments);
    this.set('componentTemplateText', new htmlSafe(
      '{{flexberry-simpledatetime<br>' +
      '  type=type<br>' +
      '  removeButton=removeButton<br>' +
      '  value=model.date<br>' +
      '  min=min<br>' +
      '  max=max<br>' +
      '  readonly=readonly<br>' +
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
      settingName: 'type',
      settingType: 'enumeration',
      settingAvailableItems: ['datetime-local', 'datetime', 'date'],
      settingDefaultValue: 'datetime-local',
      bindedControllerPropertieName: 'type',
      bindedControllerPropertieDisplayName: 'type',
    });
    componentSettingsMetadata.pushObject({
      settingName: 'removeButton',
      settingType: 'boolean',
      settingDefaultValue: true,
      bindedControllerPropertieName: 'removeButton',
    });
    componentSettingsMetadata.pushObject({
      settingName: 'min',
      settingType: 'boolean',
      settingDefaultValue: this.get('min'),
      bindedControllerPropertieName: 'min',
    });
    componentSettingsMetadata.pushObject({
      settingName: 'max',
      settingType: 'boolean',
      settingDefaultValue: this.get('max'),
      bindedControllerPropertieName: 'max',
    });
    componentSettingsMetadata.pushObject({
      settingName: 'value',
      settingType: 'boolean',
      settingDefaultValue: undefined,
      bindedControllerPropertieName: 'value',
      bindedControllerPropertieDisplayName: 'model.date'
    });
    componentSettingsMetadata.pushObject({
      settingName: 'readonly',
      settingType: 'boolean',
      settingDefaultValue: 'false',
      bindedControllerPropertieName: 'readonly'
    });

    return componentSettingsMetadata;
  }),
});
