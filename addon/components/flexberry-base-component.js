/**
 * @module ember-flexberry
 */

import Ember from 'ember';

/**
 * Base component for Flexberry Ember UI Components.
 *
 * @class FlexberryBaseComponent
 */
export default Ember.Component.extend({
  /**
   * Flag to make control readonly.
   *
   * @property readonly
   * @type Boolean
   * @default undefined
   */
  readonly: false,

  /**
   * Unique name of the component.
   * TODO: use guidFor from 'ember-metal/utils'
   *
   * @property componentName
   * @type String
   * @default undefined
   */
  componentName: undefined
});
