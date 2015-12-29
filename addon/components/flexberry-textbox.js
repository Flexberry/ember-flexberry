/**
 * @module ember-flexberry
 */

import FlexberryBaseComponent from './flexberry-base-component';

/**
 * Textbox component for Semantic UI.
 *
 * @class FlexberryTextbox
 * @extends FlexberryBaseComponent
 */
var FlexberryTextbox = FlexberryBaseComponent.extend({
  /**
   * Default classes for component wrapper.
   *
   * @property classNames
   * @type Array
   * @readOnly
   */
  classNames: ['flexberry-textbox', 'ui', 'input', 'fluid'],

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

export default FlexberryTextbox;
