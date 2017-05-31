/**
  @module ember-flexberry
*/

import FlexberryBaseComponent from 'ember-flexberry/components/flexberry-base-component';
import Ember from 'ember';

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
    Initializes component.
  */
  init() {
    this._super(...arguments);

    if (Ember.isNone(this.get('value')))
    {
      this.set('value', false);
    }
  },

  /**
    Handles changes in value and change attribute checked.

    @property _valueDidChange
    @type Ember.observer
    @readOnly
  */
  _valueDidChange: Ember.observer('value', '_$input', function() {
    let $input = this.get('_$input');
    if (this.get('value'))
    {
      $input.attr('checked', 'checked');
    }else
    {
      $input.removeAttr('checked');
    }
  }),

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
    Selected jQuery object, containing checkbox-input.

  @property _$input
  @type <a href="http://api.jquery.com/Types/#jQuery">JQuery.Object</a>
  @default null
  @private
  */
  _$input: null,

  /**
    Initializes DOM-related component's properties.
  */
  didInsertElement() {
    this.set('_$input', this.$('input'));

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
  },

  /**
    Destroys DOM-related component's properties.
  */
  willDestroyElement() {
    this._super(...arguments);

    this.set('_$input', null);

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
