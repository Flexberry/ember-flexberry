/**
 * @module ember-flexberry
 */

import FlexberryBaseComponent from './flexberry-base-component';

/**
 * Menu component for Semantic UI.
 *
 * @class FlexberryMenuComponent
 * @extends FlexberryBaseComponent
 */
export default FlexberryBaseComponent.extend({
  /**
   * Class names for component wrapping element.
   */
  classNames: ['flexberry-menu', 'ui', 'menu'],

  /**
   * Class names bindings for component's wrapping element.
   */
  classNameBindings: ['type'],

  /**
   * Menu type from Semantic UI ('vertical', 'fluid', 'compact', 'icon', 'labled', ...).
   * Types can be combined ('fluid icon labled vertical' or 'compact vertical', ...).
   * @property type
   * @type String
   * @default ''
   */
  type: '',

  /**
   * Path to component's settings in application configuration (JSON from ./config/environment.js).
   *
   * @property appConfigSettingsPath
   * @type String
   * @default 'APP.components.flexberryCheckbox'
   */
  appConfigSettingsPath: 'APP.components.flexberryMenu',

  /**
   * Menu items.
   *
   * @property items
   * @type Array[]
   * @default null
   */
  items: [],

  /**
   * Initializes component.
   */
  init: function() {
    this._super(...arguments);
  }
});
