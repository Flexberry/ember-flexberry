/**
 * @module ember-flexberry
 */

import FlexberryBaseComponent from './flexberry-base-component';

/**
 * Field component for Semantic UI.
 *
 * @class FlexberryField
 * @extends FlexberryBaseComponent
 */
var FlexberryField = FlexberryBaseComponent.extend({
  /**
   * Default classes for component wrapper.
   *
   * @property classNames
   * @type Array
   * @readOnly
   */
  classNames: ['flexberry-field', 'field'],

  /**
   * Flag to make control required.
   *
   * @property required
   * @type Boolean
   * @default false
   */
  required: false,

  /**
   * Label value.
   *
   * @property label
   * @type String
   * @default ''
   */
  label: '',

  /**
   * Input value.
   *
   * @property value
   * @type String
   * @default undefined
   */
  value: undefined
});

export default FlexberryField;
