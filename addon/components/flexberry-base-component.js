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
   * @default false
   */
  readonly: false,

  // TODO: add unit test.
  /**
   * Readonly HTML attribute following to the `readonly` query param. According to the W3C standard, returns 'readonly' if `readonly` is `true` and `undefined` otherwise.
   *
   * @property readonlyAttr
   * @type String|undefined
   * @default undefined
   * @readOnly
   */
  readonlyAttr: Ember.computed('readonly', function() {
    return this.get('readonly') ? 'readonly' : undefined;
  }),

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
