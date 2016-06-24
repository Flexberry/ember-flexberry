/**
 * @module ember-flexberry
 */

import Ember from 'ember';
import FlexberryBaseComponent from './flexberry-base-component';

/**
 * Menu item component for Semantic UI menus.
 *
 * @class FlexberryMenuitemComponent
 * @extends FlexberryBaseComponent
 */
export default FlexberryBaseComponent.extend({
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
   * @property item
   * @type Object
   * @default null
   */
  item: null,

  /**
   * Flag: indicates whether menu item has some nested subitems or not.
   *
   * @property hasSubitems
   * @type Boolean
   * @readonly
   */
  hasSubitems: Ember.computed('item.items', function() {
    var subItems = this.get('item.items');
    return Ember.isArray(subItems) && subItems.length > 0;
  }),

  /**
   * Flag: indicates whether menu item's title should be placed before it's icon.
   *
   * @property titleIsBeforeIcon
   * @type Boolean
   * @readonly
   */
  titleIsBeforeIcon: Ember.computed('item.iconAlignment', function() {
    var iconAlignment = this.get('item.iconAlignment');
    if (Ember.typeOf(iconAlignment) === 'string') {
      iconAlignment = iconAlignment.trim();
    }

    return iconAlignment === 'right' || iconAlignment === 'top';
  }),

  /**
   * Initializes DOM-related component's logic.
   */
  didInsertElement() {
    this._super(...arguments);

    // Store item object in DOM-element data attribute.
    // It will be used in root 'flexberry-menu' component to handle click on this 'flexberry-menuitem'.
    let item = this.get('item');
    if (this.get('tagName') !== '') {
      this.$().data('flexberry-menuitem.item', item);
    }
  },

  /**
   * Cleans up DOM-related component's logic.
   */
  willDestroyElement() {
    this._super(...arguments);

    // Remove stored item object from DOM-element data attribute.
    if (this.get('tagName') !== '') {
      this.$().removeData('flexberry-menuitem.item');
    }
  }
});
