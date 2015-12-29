/**
 * @module ember-flexberry
 */

import FlexberryBaseComponent from './flexberry-base-component';

/**
 * Textarea component for Semantic UI.
 *
 * @class FlexberryTextarea
 * @extends FlexberryBaseComponent
 */
export default FlexberryBaseComponent.extend({
  /**
   * Default classes for component wrapper.
   *
   * @property classNames
   * @type Array
   * @readOnly
   */
  classNames: ['flexberry-textarea'],

  /**
   * Input value.
   *
   * @property value
   * @type String
   * @default undefined
   */
  value: undefined
});
