/**
 * @module ember-flexberry
 */

import FlexberryBaseComponent from './flexberry-base-component';

/**
 * Checkbox component for Semantic UI.
 *
 * @class FlexberrCheckbox
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
