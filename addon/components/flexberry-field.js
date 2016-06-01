/**
 * @module ember-flexberry
 */

import FlexberryBaseComponent from './flexberry-base-component';
import { translationMacro as t } from 'ember-i18n';

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
   * Path to component's settings in application configuration (JSON from ./config/environment.js).
   *
   * @property appConfigSettingsPath
   * @type String
   * @default 'APP.components.flexberryField'
   */
  appConfigSettingsPath: 'APP.components.flexberryField',

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
   * @type String
   * @default 't('components.flexberry-field.placeholder')'
   */
  placeholder: t('components.flexberry-field.placeholder'),

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
    this.initProperty({ propertyName: 'placeholder', defaultValue: null });
  }
});

export default FlexberryField;
