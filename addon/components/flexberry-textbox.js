/**
 * @module ember-flexberry
 */

import FlexberryBaseComponent from './flexberry-base';

/**
 * Textbox component for Semantic UI.
 *
 * @class FlexberryTextbox
 */
export default FlexberryBaseComponent.extend({
  /**
   * Tag name for component wrapper.
   * Required by Semantic UI.
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
  classNames: ['flexberry-textbox', 'ui', 'input'],

  /**
   * Flag to make control required.
   *
   * @property required
   * @type Boolean
   * @default false
   */
  required: false,

  /**
   * Input value.
   *
   * @property value
   * @type String
   * @default undefined
   */
  value: undefined
});
