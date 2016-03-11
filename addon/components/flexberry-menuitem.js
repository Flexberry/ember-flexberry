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
  tagName: Ember.computed('hasSubitems', function() {
    return this.get('hasSubitems') ? 'div' : 'a';
  }),

  /**
   * Class names for component wrapping element.
   */
  classNames: ['flexberry-menuitem', 'item'],

  /**
   * Class names bindings for component's wrapping element.
   */
  classNameBindings: ['hasSubitems:ui', 'hasSubitems:simple', 'hasSubitems:dropdown'],

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
   * Initializes file-control component.
   */
  init: function() {
    this._super(...arguments);
  }
});
