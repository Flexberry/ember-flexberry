/**
 * @module ember-flexberry
 */

import Ember from 'ember';
import FlexberryBaseComponent from './flexberry-base-component';

/**
 * Menu item for Semantic UI menus.
 *
 * @class FlexberryMenuitemComponent
 * @extends FlexberryBaseComponent
 */
export default FlexberryBaseComponent.extend({
  /**
   * Override component's wrapping element tag.
   */
  tagName: 'a',

  /**
   * Class names for component's wrapping element.
   */
  classNames: ['flexberry-menuitem', 'item'],

  /**
   * Path to component's settings in application configuration (JSON from ./config/environment.js).
   *
   * @property appConfigSettingsPath
   * @type String
   * @default 'APP.components.flexberryCheckbox'
   */
  appConfigSettingsPath: 'APP.components.flexberryMenuitem',

  /**
   * Menu item content.
   *
   * @property content
   * @type Object
   * @default null
   */
  content: null,

  /**
   * Flag: indicates whether menu item has some nested subitems or not.
   *
   * @property hasSubitems
   * @type Boolean
   * @readonly
   */
  hasSubitems: Ember.computed('content.items', function() {
    var contentItems = this.get('content.items');
    return Ember.isArray(contentItems) && contentItems.length > 0;
  }),

  /**
   * Initializes component.
   */
  init: function() {
    this._super(...arguments);

    // Override component's wrapping element for simple menu items.
    if (this.get('hasSubitems')) {
      this.set('tagName', 'div');

      var classNames = this.get('classNames');
      classNames.push(...['ui', 'simple', 'dropdown']);
    }
  }
});
