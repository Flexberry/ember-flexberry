/**
  @module ember-flexberry
*/

import Component from '@ember/component';
import $ from 'jquery';
import RequiredActionsMixin from '../mixins/required-actions';
import DomActionsMixin from '../mixins/dom-actions';
import DynamicPropertiesMixin from '../mixins/dynamic-properties';
import DynamicActionsMixin from '../mixins/dynamic-actions';

/**
  Component's CSS-classes names.
  JSON-object containing string constants with CSS-classes names related to component's .hbs markup elements.

  @property {Object} flexberryClassNames
  @property {String} flexberryClassNames.prefix Component's CSS-class names prefix ('flexberry-colorpicker').
  @property {String} flexberryClassNames.wrapper Component's wrapping <div> CSS-class name ('flexberry-colorpicker').
  @readonly
  @static

  @for FlexberryColorpickerComponent
*/
const flexberryClassNamesPrefix = 'flexberry-colorpicker';
const flexberryClassNames = {
  prefix: flexberryClassNamesPrefix,
  wrapper: flexberryClassNamesPrefix,
  input: flexberryClassNamesPrefix + '-input'
};

/**
  Flexberry colorpicker component based on jquery-minicolors plugin (see http://labs.abeautifulsite.net/jquery-minicolors).

  Usage:
  templates/my-form.hbs
  ```handlebars
  {{flexberry-colorpicker
    value=model.color
    change=(action "onModelColorChange")
  }}
  ```

  controllers/my-form.js
  ```javascript
  actions: {
    onModelColorChange(e) {
      // Set new value to model's 'color' property.
      this.set('model.color', e.newValue);

      // Log original jQuery 'change' event object.
      console.log(e.originalEvent);
    }
  }
  ```

  Usage with {{#crossLink "FlexberryDdauCheckboxActionsHandlerMixin"}}flexberry-ddau-checkbox-actions-handler mixin{{/crossLink}}:
  ```handlebars
  {{flexberry-colorpicker
    value=model.color
    change=(action "onColorpickerChange" "model.color")
  }}
  ```

  controllers/my-form.js
  ```javascript
  import Controller from '@ember/controller';
  import FlexberryColorpickerActionsHandlerMixin from 'ember-flexberry/mixins/flexberry-colorpicker-actions-handler';

  export default Controller.extend(FlexberryColorpickerActionsHandlerMixin, {
  });
  ```

  @class FlexberryColorpickerComponent
  @extends <a href="http://emberjs.com/api/classes/Ember.Component.html">Ember.Component</a>
  @uses RequiredActionsMixin
  @uses DomActionsMixin
  @uses DynamicActionsMixin
  @uses DynamicPropertiesMixin
*/
let FlexberryColorpickerComponent = Component.extend(
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
      {{flexberry-icon
        class="map icon"
      }}
      ```

      @property classNames
      @type String[]
      @default ['flexberry-colorpicker']
    */
    classNames: [flexberryClassNames.wrapper],

    actions: {
      /**
        Handles inner input's bubbled 'change' action.
        Invokes component's {{#crossLink "FlexberryColorpicker/sendingActions.change:method"}}'change'{{/crossLink}} action.

        @method actions.change
        @param {Object} e [jQuery event object](http://api.jquery.com/category/events/event-object/)
        which describes inner input's 'change' event.
      */
      change(e) {
        let $input = $(e.target);
        if (!$input.hasClass(flexberryClassNames.input)) {
          return false;
        }

        let { value, opacity } = $input.data('minicolors-lastChange') || { value: null, opacity: null };

        // Invoke component's custom 'change' action.
        this.sendAction('change', {
          newValue: value,
          newOpacity: opacity,
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

      // Initialize jquery-minicolors (see more settings http://labs.abeautifulsite.net/jquery-minicolors/#settings).
      this.$(`.${flexberryClassNames.input}`).minicolors({
        theme: 'semanticui'
      });
    },

    /**
      Destroys DOM-related component's properties.
    */
    willDestroyElement() {
      this._super(...arguments);

      // Destroys jquery-minicolors.
      this.$(`.${flexberryClassNames.input}`).minicolors('destroy');
    }

    /**
      Component's action invoking when color changed.

      @method sendingActions.change
      @param {Object} e Action's event object.
      @param {Boolean} e.newValue Component's new value.
      @param {Object} e.originalEvent [jQuery event object](http://api.jquery.com/category/events/event-object/) which describes inner input's 'change' event.
    */
  }
);

// Add component's CSS-class names as component's class static constants
// to make them available outside of the component instance.
FlexberryColorpickerComponent.reopenClass({
  flexberryClassNames
});

export default FlexberryColorpickerComponent;
