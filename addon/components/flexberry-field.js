/**
 * @module ember-flexberry
 */

import FlexberryTextbox from './flexberry-textbox';

/**
 * Field component for Semantic UI.
 *
 * @class FlexberryField
 * @extends FlexberryBaseComponent
 */
var FlexberryField = FlexberryTextbox.extend({
  /**
   * Default classes for component wrapper.
   *
   * @property classNames
   * @type Array
   * @readOnly
   */
  classNames: ['flexberry-field', 'field'],

  /**
   * Path to component's settings in application configuration (JSON from ./config/environment.js).
   *
   * @property appConfigSettingsPath
   * @type String
   * @default 'APP.components.flexberryField'
   */
  appConfigSettingsPath: 'APP.components.flexberryField',

  /**
   * Label value.
   *
   * @property label
   * @type String
   * @default ''
   */
  label: undefined,

  /**
   * Initializes component.
   */
  init: function() {
    this._super(...arguments);

    // Initialize properties which defaults could be defined in application configuration.
    this.initProperty({ propertyName: 'label', defaultValue: '' });
  }
});

export default FlexberryField;
