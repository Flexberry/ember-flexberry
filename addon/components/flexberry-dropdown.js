/**
  @module ember-flexberry
*/
import $ from 'jquery';
import { computed } from '@ember/object';
import { isArray } from '@ember/array';
import { run } from '@ember/runloop';
import FlexberryBaseComponent from './flexberry-base-component';
import { translationMacro as t } from 'ember-i18n';
import FixableComponent from '../mixins/fixable-component';

/**
  Dropdown component based on Semantic UI Dropdown module.

  @example
    templates/my-form.hbs
    ```handlebars
    {{flexberry-dropdown
      items=items
      value=value
      settings=(hash
        duration=500
        direction="upward"
      )
    }}
    ```

  @class FlexberryDropdownComponent
  @extends FlexberryBaseComponent
*/
export default FlexberryBaseComponent.extend(FixableComponent, {
  /**
    @private
    @property _initialized
    @type Boolean
    @default false
  */
  _initialized: false,

  /**
    @private
    @property _items
    @type Object
  */
  _items: undefined,

  /**
    @private
    @property _value
    @type String
  */
  _value: undefined,

  /**
    See [EmberJS API](https://emberjs.com/api/).

    @property classNameBindings
  */
  classNameBindings: ['readonly:disabled'],

  /**
    See [EmberJS API](https://emberjs.com/api/).

    @property classNames
  */
  classNames: ['ui', 'dropdown', 'flexberry-dropdown', 'selection'],

  /**
    See [Semantic UI API](https://semantic-ui.com/modules/dropdown.html#/settings).

    @property settings
    @type Object
  */
  settings: undefined,

  /**
    Path to component's settings in application configuration (JSON from ./config/environment.js).

    @property appConfigSettingsPath
    @type String
    @default APP.components.flexberryDropdown
  */
  appConfigSettingsPath: 'APP.components.flexberryDropdown',

  /**
    Placeholder or default text (will be displayed if there is no selected item).

    @property placeholder
    @type String
    @default t('components.flexberry-dropdown.placeholder')
  */
  placeholder: t('components.flexberry-dropdown.placeholder'),

  /**
    Flag indicates whether to display captions for dropdown items.
    To make it work, "items" property should have following structure:
    {
      item1: 'caption for item1',
      item2: 'caption for item2'
    }
    For example, user will see 'caption for item1', but on choose, item1 is set to 'value' property.

    @property displayCaptions
    @type Boolean
    @default false
  */
  displayCaptions: false,

  /**
    Flag indicates whether to make checks on selected value or not.
    It has `false` value when component loads data by request by semantic processes.
    It is not recommended to change its value out of addon.

    @property needChecksOnValue
    @type Boolean
    @default true
  */
  needChecksOnValue: true,

  /**
    Flag indicates whether to show input with search class.

    @property isSearch
    @type Boolean
    @default false
  */
  isSearch: false,

  /**
    Available items.

    @property items
    @type Object
  */
  items: computed('_items', {
    get() {
      return this.get('_items');
    },
    set(key, value) {
      let items = value;
      if (isArray(value)) {
        items = {};
        for (let i = 0; i < value.length; i++) {
          items[i] = value[i];
        }
      }

      return this.set('_items', items);
    },
  }),

  /**
    Selected item.

    @property value
    @type Any
  */
  value: computed('_value', 'items', 'displayCaptions', {
    get() {
      const valueKey = this.get('_value');

      if (this.get('displayCaptions')) {
        return valueKey;
      }

      return valueKey ? this.get(`items.${valueKey}`) : undefined;
    },
    set(key, value, oldValue) {
      const items = this.get('items');
      if (items && value && value !== oldValue) {
        let valueKey;
        for (let key in items) {
          if (items.hasOwnProperty(key) && items[key] === value) {
            valueKey = key;
          }
        }

        if (valueKey) {
          return this.get(`items.${this.set('_value', valueKey)}`);
        } else if (this.get('needChecksOnValue')) {
          throw new Error(`Wrong value of flexberry-dropdown 'value' property: '${value}'.`);
        }
      }

      if (!value && this.get('_initialized')) {
        this.$().dropdown('clear');
      }

      if (this.get('displayCaptions')) {
        this.set('_value', value);
      }

      return value;
    },
  }),

  /**
    Selected item or placeholder.

    @property text
    @type Any
    @readOnly
  */
  text: computed('_value', 'value', 'items', 'placeholder', 'displayCaptions', function () {
    if (this.get('displayCaptions')) {
      const items = this.get('items');
      const value = this.get('_value');

      return value ? items[value] : this.get('placeholder');
    }

    return this.get('value') || this.get('placeholder');
  }).readOnly(),

  /**
    @method onShowHide
   */
  onShowHide() {
    this.showFixedElement({ top: -2, left: 1 });
  },

  /**
    See [EmberJS API](https://emberjs.com/api/).

    @method didInsertElement
  */
  didInsertElement() {
    this._super(...arguments);

    let settings = $.extend({
      action: 'select',
      onChange: (newValue) => {
        run(() => {
          const currentValue = this.get('_value');
          if (currentValue !== newValue) {
            const oldValue = this.get('displayCaptions') ? currentValue : this.get('value');

            this.set('_value', newValue);

            const onChange = this.get('onChange');
            if (typeof onChange === 'function') {
              onChange(this.get('value'), oldValue);
            }
          }
        });
      },
      onShow: () => {
        run.next(() => {
          this.onShowHide();
        });
      },
      onHide: () => {
        run.next(() => {
          this.onShowHide();
        });
      },
    }, this.get('settings'));

    this.$().dropdown(settings);
    this.set('_initialized', true);
  },

  /**
    See [EmberJS API](https://emberjs.com/api/).

    @method willDestroyElement
  */
  willDestroyElement() {
    this._super(...arguments);

    if (this.get('_initialized')) {
      this.set('_initialized', false);
      this.$().dropdown('destroy');
    }
  },
});
