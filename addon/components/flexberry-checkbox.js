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
   * Overload wrapper tag name for disabling wrapper.
   *
   * @property tagName
   * @type String
   * @default ''
   * @readOnly
   */
  tagName: '',

  /**
   * Path to component's settings in application configuration (JSON from ./config/environment.js).
   *
   * @property appConfigSettingsPath
   * @type String
   * @default 'APP.components.flexberryCheckbox'
   */
  appConfigSettingsPath: 'APP.components.flexberryCheckbox',

  /**
   * Current checked value.
   *
   * @property value
   * @type Boolean
   * @default false
   */
  value: false,

  /**
   * Label for the checkbox.
   *
   * @property label
   * @type String
   * @default undefined
   */
  label: undefined,

  /**
   * Initializes file-control component.
   */
  init: function () {
    this._super(...arguments);
  }
});
