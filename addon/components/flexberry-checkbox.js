/**
  @module ember-flexberry
*/

import Ember from 'ember';
import FlexberryBaseComponent from 'ember-flexberry/components/flexberry-base-component';

/**
  Flexberry checkbox component with [Semantic UI checkbox](http://semantic-ui.com/modules/checkbox.html) style.

  @example
    templates/my-form.hbs
    ```handlebars
    {{flexberry-checkbox
      value=model.flag
      onChange=(action "onModelFlagChange")
    }}
    ```

    controllers/my-form.js
    ```javascript
    actions: {
      onModelFlagChange(e) {
        console.log('Model flag changed: ', e.checked);
      }
    }
    ```

  @class FlexberryCheckboxComponent
  @extends FlexberryBaseComponent
*/
export default FlexberryBaseComponent.extend({
  /**
    Component's wrapping <div> CSS-classes names.

    Any other CSS-classes can be added through component's 'class' property.

    @example
      ```handlebars
      {{flexberry-checkbox class="toggle" value=model.flag}}
      ```

    @property classNames
    @type String[]
    @default ['flexberry-checkbox', 'ui', 'checkbox']
  */
  classNames: ['flexberry-checkbox', 'ui', 'checkbox'],

  /**
    Components class names bindings.

    @property classNameBindings
    @type String[]
    @default ['value:checked', 'readonly:read-only']
  */
  classNameBindings: ['value:checked', 'readonly:read-only'],

  /**
    Component's value (if true, then checkbox is checked).

    @property value
    @type Boolean
    @default false
  */
  value: false,

  /**
    Component's label.

    @property label
    @type String
    @default null
  */
  label: null,

  /**
    Flag: indicates whether value can be null.

    @property isNullable
    @type Boolean
    @default false
  */
  isNullable: false,

  valueObserver: Ember.observer('value', function() {
    const value = this.get('value');
    if (this.get('isNullable') && Ember.isNone(this.get('value'))) {
      this.$().checkbox('set indeterminate');
      return;
    }

    this.$('.flexberry-checkbox-input').prop('checked', value);
  }),

  /**
    Initializes DOM-related component's properties.
  */
  didInsertElement() {
    this._super(...arguments);

    // Initialize Semantic UI checkbox.
    this.$().checkbox({
      onChecked: () => {
        this.set('value', true);
        this.sendAction('onChange', {
          checked: true
        });
      },
      onUnchecked: () => {
        this.set('value', false);
        this.sendAction('onChange', {
          checked: false
        });
      }
    });

    if (this.get('isNullable') && Ember.isNone(this.get('value'))) {
      this.$().checkbox('set indeterminate');
      return;
    }

    if (this.get('value')) {
      this.$().checkbox('set checked');
    }
  },

  /**
    Destroys DOM-related component's properties.
  */
  willDestroyElement() {
    this._super(...arguments);

    // Destroys Semantic UI checkbox.
    this.$().checkbox('destroy');
  },

  /**
    Component's action invoking when checkbox was clicked and it's 'checked' state changed.

    @method sendingActions.onChange
    @param {Object} e Action's event object.
    @param {Boolean} e.checked Component's current value.
  */
});
