/**
  @module ember-flexberry
*/

import Component from '@ember/component';
import RequiredActionsMixin from '../mixins/required-actions';
import DomActionsMixin from '../mixins/dom-actions';
import DynamicPropertiesMixin from '../mixins/dynamic-properties';
import DynamicActionsMixin from '../mixins/dynamic-actions';
import { isEmpty } from '@ember/utils';

/**
  Component's CSS-classes names.
  JSON-object containing string constants with CSS-classes names related to component's .hbs markup elements.

  @property {Object} flexberryClassNames
  @property {String} flexberryClassNames.prefix Component's CSS-class names prefix ('flexberry-checkbox').
  @property {String} flexberryClassNames.wrapper Component's wrapping <div> CSS-class name ('flexberry-checkbox').
  @property {String} flexberryClassNames.checkboxInput Component's inner <input type="checkbox"> CSS-class name ('flexberry-checkbox-input').
  @property {String} flexberryClassNames.checkboxCaption Component's inner <label> CSS-class name ('flexberry-checkbox-caption').
  @readonly
  @static

  @for FlexberryDdauCheckboxComponent
*/
const flexberryClassNamesPrefix = 'flexberry-checkbox';
const flexberryClassNames = {
  prefix: flexberryClassNamesPrefix,
  wrapper: flexberryClassNamesPrefix,
  checkboxInput: flexberryClassNamesPrefix + '-input',
  checkboxCaption: flexberryClassNamesPrefix + '-caption'
};

/**
  Flexberry checkbox component with [Semantic UI checkbox](http://semantic-ui.com/modules/checkbox.html) style
  and ["Data Down Actions UP (DDAU)" pattern](https://emberway.io/ember-js-goodbye-mvc-part-1-21777ecfd708) one way binding.
  Component doesn't mutate passed value by its own, it only invokes 'change' action,
  which signalizes to the route, controller, or another component, that passed value should be mutated.

  Usage with manual 'change' action handling:
  templates/my-form.hbs
  ```handlebars
  {{flexberry-ddau-checkbox
    value=model.flag
    change=(action "onModelFlagChange")
  }}
  ```

  controllers/my-form.js
  ```javascript
  actions: {
    onModelFlagChange(e) {
      // Set new value to model's 'flag' property.
      this.set('model.flag', e.newValue);

      // Log jQuery 'change' event object triggered after checkbox input was clicked.
      console.log(e.originalEvent);
    }
  }
  ```

  Usage with {{#crossLink "FlexberryDdauCheckboxActionsHandlerMixin"}}flexberry-ddau-checkbox-actions-handler mixin{{/crossLink}}:
  ```handlebars
  {{flexberry-ddau-checkbox
    value=model.flag
    change=(action "onCheckboxChange" "model.flag")
  }}
  ```

  controllers/my-form.js
  ```javascript
  import Controller from '@ember/controller';
  import FlexberryDdauCheckboxActionsHandlerMixin from 'ember-flexberry/mixins/flexberry-ddau-checkbox-actions-handler';

  export default Controller.extend(FlexberryDdauCheckboxActionsHandlerMixin, {
  });
  ```

  @class FlexberryDdauCheckboxComponent
  @extends <a href="http://emberjs.com/api/classes/Ember.Component.html">Ember.Component</a>
  @uses RequiredActionsMixin
  @uses DomActionsMixin
  @uses DynamicActionsMixin
  @uses DynamicPropertiesMixin
*/
let FlexberryDdauCheckboxComponent = Component.extend(
  RequiredActionsMixin,
  DomActionsMixin,
  DynamicActionsMixin,
  DynamicPropertiesMixin, {

    /**
      Component's required actions names.
      For actions enumerated in this array an assertion exceptions will be thrown,
      if actions handlers are not defined for them.

      @property _requiredActions
      @type String[]
      @default ['change']
    */
    _requiredActionNames: undefined,

    /**
      Reference to component's CSS-classes names.
      Must be also a component's instance property to be available from component's .hbs template.
    */
    flexberryClassNames,

    /**
      Component's wrapping <div> CSS-classes names.

      Any other CSS-classes can be added through component's 'class' property.
      ```handlebars
      {{flexberry-ddau-checkbox class="toggle" value=model.flag change=(action "onModelFlagChange")}}
      ```

      @property classNames
      @type String[]
      @default ['flexberry-checkbox', 'ui', 'checkbox']
    */
    classNames: [flexberryClassNames.wrapper, 'ui', 'checkbox'],

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
      Component's caption.

      @property caption
      @type String
      @default null
    */
    caption: null,

    /**
      Flag: indicates whether component is in readonly mode.

      @property readonly
      @type Boolean
      @default false
    */
    readonly: false,

    actions: {
      /**
        Handles inner input's bubbled 'change' action.
        Invokes component's {{#crossLink "FlexberryDdauCheckbox/sendingActions.change:method"}}'change'{{/crossLink}} action.

        @method actions.change
        @param {Object} e [jQuery event object](http://api.jquery.com/category/events/event-object/)
        which describes inner input's 'change' event.
      */
      change(e) {
        let checked = e.target.checked === true;

        // Invoke component's custom 'change' action.
        if (!isEmpty(this.get('onChange'))) {
          this.get('onChange')({
          newValue: checked,
            originalEvent: e
          });
        }

        // Prevent second call to this.sendAction('change', ...) inside dom-actions mixin,
        // otherwise component's outer 'change' action handler will be called twice.
        return false;
      }
    },

    /**
      An overridable method called when objects are instantiated.
    */
    init() {
      this._super(...arguments);
      this.set('_requiredActionNames', ['change']);
    },

    /**
      Initializes DOM-related component's properties.
    */
    didInsertElement() {
      this._super(...arguments);

      // Initialize Semantic UI checkbox.
      this.$().checkbox();
    },

    /**
      Destroys DOM-related component's properties.
    */
    willDestroyElement() {
      this._super(...arguments);

      // Destroys Semantic UI checkbox.
      this.$().checkbox('destroy');
    }

    /**
      Component's action invoking when checkbox was clicked and it's 'checked' state changed.

      @method sendingActions.change
      @param {Object} e Action's event object.
      @param {Boolean} e.newValue Component's new value.
      @param {Object} e.originalEvent [jQuery event object](http://api.jquery.com/category/events/event-object/)
      which describes inner input's 'change' event.
    */
  }
);

// Add component's CSS-class names as component's class static constants
// to make them available outside of the component instance.
FlexberryDdauCheckboxComponent.reopenClass({
  flexberryClassNames
});

export default FlexberryDdauCheckboxComponent;
