/**
  @module ember-flexberry
*/

import Component from '@ember/component';
import RequiredActionsMixin from '../mixins/required-actions';
import DomActionsMixin from '../mixins/dom-actions';
import DynamicActionsMixin from '../mixins/dynamic-actions';
import DynamicPropertiesMixin from '../mixins/dynamic-properties';

/**
  Component's CSS-classes names.
  JSON-object containing string constants with CSS-classes names related to component's .hbs markup elements.

  @property {Object} flexberryClassNames
  @property {String} flexberryClassNames.prefix Component's CSS-class names prefix ('flexberry-icon').
  @property {String} flexberryClassNames.wrapper Component's wrapping <div> CSS-class name ('flexberry-icon').
  @readonly
  @static

  @for FlexberryIconComponent
*/
const flexberryClassNamesPrefix = 'flexberry-icon';
const flexberryClassNames = {
  prefix: flexberryClassNamesPrefix,
  wrapper: flexberryClassNamesPrefix
};

/**
  Flexberry icon component with [Semantic UI icons](http://semantic-ui.com/modules/icon.html) style.

  Usage:
  templates/my-form.hbs
  ```handlebars
  {{flexberry-icon
    class="map icon"
  }}
  ```

  @class FlexberryIconComponent
  @extends <a href="http://emberjs.com/api/classes/Ember.Component.html">Ember.Component</a>
  @uses RequiredActionsMixin
  @uses DomActionsMixin
  @uses DynamicActionsMixin
  @uses DynamicPropertiesMixin
*/
let FlexberryIconComponent = Component.extend(
  RequiredActionsMixin,
  DomActionsMixin,
  DynamicActionsMixin,
  DynamicPropertiesMixin, {

    /**
      Reference to component's CSS-classes names.
      Must be also a component's instance property to be available from component's .hbs template.
    */
    flexberryClassNames,

    /**
      Overridden ['tagName'](http://emberjs.com/api/classes/Ember.Component.html#property_tagName)
      to force <i> to be a component's wrapping element.

      @property tagName
      @type String
      @default 'i'
    */
    tagName: 'i',

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
      @default ['flexberry-icon']
    */
    classNames: [flexberryClassNames.wrapper]
  }
);

// Add component's CSS-class names as component's class static constants
// to make them available outside of the component instance.
FlexberryIconComponent.reopenClass({
  flexberryClassNames
});

export default FlexberryIconComponent;
