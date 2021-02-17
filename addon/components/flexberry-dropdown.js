/* eslint-disable ember/use-ember-get-and-set */
/**
 * @module ember-flexberry
 */
import Ember from 'ember';
import FlexberryBaseComponent from './flexberry-base-component';
import { translationMacro as t } from 'ember-i18n';

/**
 * Dropdown component based on Semantic UI Dropdown module.
 *
 * @example
 *   templates/my-form.hbs
 *   ```handlebars
 *   {{flexberry-dropdown
 *     items=items
 *     value=value
 *     settings=(hash
 *       duration=500
 *       direction="upward"
 *     )
 *   }}
 *   ```
 *
 * @class FlexberryDropdownComponent
 * @extends FlexberryBaseComponent
 */
export default FlexberryBaseComponent.extend({
  /**
   * @private
   * @property {boolean} _initialized
   * @default false
   */
  _initialized: false,

  /**
   * @private
   * @property {object} _items
   */
  _items: undefined,

  /**
   * @private
   * @property {string} _value
   */
  _value: undefined,

  /**
   * See [EmberJS API](https://emberjs.com/api/).
   *
   * @property classNameBindings
   */
  classNameBindings: ['readonly:disabled'],

  /**
   * See [EmberJS API](https://emberjs.com/api/).
   *
   * @property classNames
   */
  classNames: ['ui', 'dropdown', 'flexberry-dropdown', 'selection'],

  /**
   * See [Semantic UI API](https://semantic-ui.com/modules/dropdown.html#/settings).
   *
   * @property {object} settings
   */
  settings: undefined,

  /**
   * Path to component's settings in application configuration (JSON from ./config/environment.js).
   *
   * @property {string} appConfigSettingsPath
   * @default APP.components.flexberryDropdown
   */
  appConfigSettingsPath: 'APP.components.flexberryDropdown',

  /**
   * Placeholder or default text (will be displayed if there is no selected item).
   *
   * @property {string} placeholder
   * @default t('components.flexberry-dropdown.placeholder')
   */
  placeholder: t('components.flexberry-dropdown.placeholder'),

  /**
   * Flag indicates whether to display captions for dropdown items.
   * To make it work, "items" property should have following structure:
   * {
   *   item1: 'caption for item1',
   *   item2: 'caption for item2'
   * }
   * For example, user will see 'caption for item1', but on choose, item1 is set to 'value' property.
   *
   * @property {boolean} displayCaptions
   * @default false
   */
  displayCaptions: false,

  /**
   * Flag indicates whether to make checks on selected value or not.
   * It has `false` value when component loads data by request by semantic processes.
   * It is not recommended to change its value out of addon.
   *
   * @property {boolean} needChecksOnValue
   * @default true
   */
  needChecksOnValue: true,

  /**
   * Flag indicates whether to show input with search class.
   *
   * @property {boolean} isSearch
   * @default false
   */
  isSearch: false,

  /**
   * Available items.
   *
   * @property {object} items
   */
  items: Ember.computed('_items', {
    get() {
      return Ember.get(this, '_items');
    },
    set(key, value) {
      let items = value;
      if (Ember.isArray(value)) {
        items = {};
        for (let i = 0; i < value.length; i++) {
          items[i] = value[i];
        }
      }

      return Ember.set(this, '_items', items);
    },
  }),

  /**
   * Selected item.
   *
   * @property value
   * @type Any
   */
  value: Ember.computed('_value', 'items', 'displayCaptions', {
    get() {
      const valueKey = Ember.get(this, '_value');

      if (Ember.get(this, 'displayCaptions')) {
        return valueKey;
      }

      return valueKey ? Ember.get(this, `items.${valueKey}`) : undefined;
    },
    set(key, value, oldValue) {
      const items = Ember.get(this, 'items');
      if (items && value && value !== oldValue) {
        let valueKey;
        for (let key in items) {
          if (Object.prototype.hasOwnProperty.call(items, key) && items[key] === value) {
            valueKey = key;
          }
        }

        if (valueKey) {
          return Ember.get(this, `items.${Ember.set(this, '_value', valueKey)}`);
        } else if (Ember.get(this, 'needChecksOnValue')) {
          throw new Error(`Wrong value of flexberry-dropdown 'value' property: '${value}'.`);
        }
      }

      if (!value && Ember.get(this, '_initialized')) {
        this.$().dropdown('clear');
      }

      if (Ember.get(this, 'displayCaptions')) {
        Ember.set(this, '_value', value);
      }

      return value;
    },
  }),

  /**
   * Selected item or placeholder.
   *
   * @property text
   * @type Any
   * @readOnly
   */
  text: Ember.computed('_value', 'value', 'items', 'placeholder', 'displayCaptions', function () {
    if (Ember.get(this, 'displayCaptions')) {
      const items = Ember.get(this, 'items');
      const value = Ember.get(this, '_value');

      return value ? items[value] : Ember.get(this, 'placeholder');
    }

    return Ember.get(this, 'value') || Ember.get(this, 'placeholder');
  }).readOnly(),

  /**
   * See [EmberJS API](https://emberjs.com/api/).
   *
   * @method didInsertElement
   */
  didInsertElement() {
    this._super(...arguments);

    let settings = Ember.$.extend({
      action: 'select',
      onChange: (newValue) => {
        Ember.run(() => {
          const currentValue = Ember.get(this, '_value');
          if (currentValue !== newValue) {
            const oldValue = Ember.get(this, 'displayCaptions') ? currentValue : Ember.get(this, 'value');

            Ember.set(this, '_value', newValue);

            const onChange = Ember.get(this, 'onChange');
            if (typeof onChange === 'function') {
              onChange(Ember.get(this, 'value'), oldValue);
            }
          }
        });
      },
    }, Ember.get(this, 'settings'));

    this.$().dropdown(settings);
    Ember.set(this, '_initialized', true);
  },

  /**
   * See [EmberJS API](https://emberjs.com/api/).
   *
   * @method willDestroyElement
   */
  willDestroyElement() {
    this._super(...arguments);

    if (Ember.get(this, '_initialized')) {
      Ember.set(this, '_initialized', false);
      this.$().dropdown('destroy');
    }
  },
});
