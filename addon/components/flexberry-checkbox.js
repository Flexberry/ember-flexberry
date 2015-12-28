/**
 * @module ember-flexberry
 */

import BaseComponent from './flexberry-base';

/**
 * Checkbox component for Semantic UI.
 *
 * @class FlexberrCheckbox
 */
export default BaseComponent.extend({
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
  classNames: ['flexberry-checkbox', 'ui', 'checkbox'],

  /**
   * Checked value.
   *
   * @property checked
   * @type Boolean
   * @default undefined
   */
  checked: undefined
});
