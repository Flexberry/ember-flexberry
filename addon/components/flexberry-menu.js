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
  },
});
