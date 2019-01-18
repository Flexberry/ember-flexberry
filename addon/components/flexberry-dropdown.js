/**
  @module ember-flexberry
*/
import $ from 'jquery';
import { computed } from '@ember/object';
import { isArray } from '@ember/array';
import { isEmpty } from '@ember/utils';
import { run } from '@ember/runloop';
import FlexberryBaseComponent from './flexberry-base-component';
import { translationMacro as t } from 'ember-i18n';

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
export default FlexberryBaseComponent.extend({
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
  value: computed('_value', 'items', {
    get() {
      let valueKey = this.get('_value');
      if (valueKey && this.get('_initialized')) {
        this.$().dropdown('set selected', valueKey);
      }

      return valueKey ? this.get(`items.${valueKey}`) : undefined;
    },
    set(key, value, oldValue) {
      let items = this.get('items');
      if (items && value && value !== oldValue) {
        let valueKey;
        for (let key in items) {
          if (items.hasOwnProperty(key) && items[key] === value) {
            valueKey = key;
          }
        }

        if (valueKey) {
          if (this.get('_initialized')) {
            this.$().dropdown('set selected', valueKey);
          }

          return this.get(`items.${this.set('_value', valueKey)}`);
        } else if (this.get('needChecksOnValue')) {
          throw new Error(`Wrong value of flexberry-dropdown 'value' property: '${value}'.`);
        }
      }

      if (!value && this.get('_initialized')) {
        this.$().dropdown('clear');
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
  text: computed.or('value', 'placeholder').readOnly(),

  /**
    See [EmberJS API](https://emberjs.com/api/).

    @method didInsertElement
  */
  didInsertElement() {
    this._super(...arguments);

    let settings = $.extend({
      action: 'select',
      onChange: (value) => {
        run(() => {
          if (this.get('_value') !== value) {
            this.set('_value', value);
            if (!isEmpty(this.get('onChange'))) {
              this.get('onChange')(this.get('value'));
            }
          }
        });
      },
    }, this.get('settings'));

    this.$().dropdown(settings);
    this.set('_initialized', true);

    let _value = this.get('_value');
    if (_value) {
      this.$().dropdown('set selected', _value);
    }
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
