/**
 * @module ember-flexberry
 */

import Ember from 'ember';

/**
 * Base component for Flexberry Ember UI Components.
 *
 * @class FlexberryBaseComponent
 */
var FlexberryBaseComponent = Ember.Component.extend({
  /**
   * Tag name for component wrapper.
   * Disabled by default (wrapper won't be rendered).
   *
   * @property tagName
   * @type String
   * @default ''
   */
  tagName: '',

  /**
   * Flag to make control readonly.
   *
   * @property readonly
   * @type Boolean
   * @default undefined
   */
  readonly: undefined,

  /**
   * Name of the component.
   *
   * @property componentName
   * @type String
   * @default undefined
   */
  componentName: undefined
});

export default FlexberryBaseComponent;
