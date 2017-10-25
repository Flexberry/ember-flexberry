/**
  @module ember-flexberry
*/

import Ember from 'ember';

/**
  ValidationSummary component for Semantic UI.

  @class FlexberryValidationsummary
  @extends Ember.Component
*/
export default Ember.Component.extend({
  /**
    A list of properties of the view to apply as class names. If the property is a string value, the value of that string will be applied as a class name.

    @property classNameBindings
    @type Array
    @default ['color']
  */
  classNameBindings: ['color'],

  /**
    Standard CSS class names to apply to the view's outer element.

    @property classNames
    @type Array
    @default ['ui', 'message']
  */
  classNames: ['ui', 'message'],

  /**
    Semantic color class name for message text.

    @property color
    @type String
    @default 'red'
  */
  color: 'red',

  /**
    If `false`, the view will appear hidden in DOM.

    @property isVisible
    @type Boolean
  */
  isVisible: Ember.computed.notEmpty('errors'),
});
