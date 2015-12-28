/**
 * @module ember-flexberry
 */

import FlexberryBaseComponent from './flexberry-base';

/**
 * Textarea component for Semantic UI.
 *
 * @class FlexberryTextarea
 */
export default FlexberryBaseComponent.extend({
  /**
   * Tag name for component wrapper.
   *
   * @property tagName
   * @type String
   * @default 'div'
   * @readOnly
   */
  tagName: 'div',

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
