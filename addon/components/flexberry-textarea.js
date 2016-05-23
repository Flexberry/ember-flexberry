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
   * Path to component's settings in application configuration (JSON from ./config/environment.js).
   *
   * @property appConfigSettingsPath
   * @type String
   * @default 'APP.components.flexberryTextarea'
   */
  appConfigSettingsPath: 'APP.components.flexberryTextarea',

  /**
   * Input value.
   *
   * @property value
   * @type String
   * @default undefined
   */
  value: undefined,

  /**
   * Text to be displayed instead of file name, if file has not been selected.
   *
   * @property placeholder
   * @type string
   * @default undefined
   */
  placeholder: undefined,

  /**
   * Initializes component.
   */
  init: function() {
    this._super(...arguments);

    // Initialize properties which defaults could be defined in application configuration.
    this.initProperty({ propertyName: 'placeholder', defaultValue: null });
  }
});
