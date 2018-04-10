/**
  @module ember-flexberry
*/

import Component from '@ember/component';
import RequiredActionsMixin from '../mixins/required-actions';
import DomActionsMixin from '../mixins/dom-actions';
import DynamicPropertiesMixin from '../mixins/dynamic-properties';
import DynamicActionsMixin from '../mixins/dynamic-actions';

/**
  Component's CSS-classes names.
  JSON-object containing string constants with CSS-classes names related to component's .hbs markup elements.

  @property {Object} flexberryClassNames
  @property {String} flexberryClassNames.prefix Component's CSS-class names prefix ('flexberry-slider').
  @property {String} flexberryClassNames.wrapper Component's wrapping <div> CSS-class name ('flexberry-slider').
  @readonly
  @static

  @for FlexberryDdauSliderComponent
*/
const flexberryClassNamesPrefix = 'flexberry-slider';
const flexberryClassNames = {
  prefix: flexberryClassNamesPrefix,
  wrapper: flexberryClassNamesPrefix
};

/**
  Flexberry slider component with bootstrap-ui-slider through ui-ember-slider
  and ["Data Down Actions UP (DDAU)" pattern](https://emberway.io/ember-js-goodbye-mvc-part-1-21777ecfd708) one way binding.
  Component doesn't mutate passed value by its own, it only invokes 'change' action,
  which signalizes to the route, controller, or another component, that passed value should be mutated.

  Usage with manual 'change' action handling:
  templates/my-form.hbs
  ```handlebars
  {{flexberry-ddau-slider
    value=model.value
    change=(action "onModelValueChange")
  }}
  ```

  controllers/my-form.js
  ```javascript
  actions: {
    onModelValueChange(e) {
      // Set new value to model's 'value' property.
      this.set('model.value', e.newValue);

      // Log jQuery 'change' event object triggered after checkbox input was clicked.
      console.log(e.originalEvent);
    }
  }
  ```

  Usage with {{#crossLink "FlexberryDdauSliderActionsHandlerMixin"}}flexberry-ddau-checkbox-actions-handler mixin{{/crossLink}}:
  ```handlebars
  {{flexberry-ddau-slider
    value=model.value
    change=(action "onSliderChange" "model.value")
  }}
  ```

  controllers/my-form.js
  ```javascript
  import Ember from 'ember';
  import FlexberryDdauSliderActionsHandlerMixin from 'ember-flexberry/mixins/flexberry-ddau-slider-actions-handler';

  export default Ember.Controller.extend(FlexberryDdauSliderActionsHandlerMixin, {
  });
  ```

  @class FlexberryDdauSliderComponent
  @extends <a href="http://emberjs.com/api/classes/Ember.Component.html">Ember.Component</a>
  @uses RequiredActionsMixin
  @uses DomActionsMixin
  @uses DynamicActionsMixin
  @uses DynamicPropertiesMixin
*/
let FlexberryDdauSliderComponent = Component.extend(
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
    _requiredActionNames: ['change'],

    /**
      Reference to component's CSS-classes names.
      Must be also a component's instance property to be available from component's .hbs template.
    */
    flexberryClassNames,

    /**
      Component's wrapping <div> CSS-classes names.

      Any other CSS-classes can be added through component's 'class' property.
      ```handlebars
      {{flexberry-ddau-slider class="toggle" value=model.value change=(action "onModelValueChange")}}
      ```

      @property classNames
      @type String[]
      @default ['flexberry-slider', 'ui']
    */
    classNames: [flexberryClassNames.wrapper, 'ui'],

    /**
      Components class names bindings.

      @property classNameBindings
      @type String[]
      @default ['readonly:read-only']
    */
    classNameBindings: ['readonly:read-only'],

    /**
      Component's min value.

      @property min
      @type Number
      @default 0.01
    */
    min: 0.01,

    /**
      Component's max value.

      @property max
      @type Number
      @default 100
    */
    max: 1,

    /**
      Component's default value.

      @property defaultValue
      @type Number
      @default 1
    */
    defaultValue: 1,

    /**
      Component's value.

      @property value
      @type Number
      @default null
    */
    value: null,
    /**
      Component's range step.

      @property step
      @type Number
      @default 1
    */
    step: 0.01,

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
        Invokes component's {{#crossLink "FlexberryDdauSlider/sendingActions.change:method"}}'change'{{/crossLink}} action.

        @method actions.change
        @param {Object} e [jQuery event object](http://api.jquery.com/category/events/event-object/)
        which describes inner input's 'change' event.
      */
      change(e) {
        let value = e.value.newValue;

        // Invoke component's custom 'change' action.
        this.sendAction('change', {
          newValue: value,
          originalEvent: e
        });

        // Prevent second call to this.sendAction('change', ...) inside dom-actions mixin,
        // otherwise component's outer 'change' action handler will be called twice.
        return false;
      }
    },

    /**
      Initializes DOM-related component's properties.
    */
    didInsertElement() {
      this._super(...arguments);
    },

    /**
      Destroys DOM-related component's properties.
    */
    willDestroyElement() {
      this._super(...arguments);
    }

    /**
      Component's action invoking when slider was moved and it's 'value' state changed.

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
FlexberryDdauSliderComponent.reopenClass({
  flexberryClassNames
});

export default FlexberryDdauSliderComponent;
