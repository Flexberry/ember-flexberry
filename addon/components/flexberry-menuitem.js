/**
 * @module ember-flexberry
 */

import Ember from 'ember';
import FlexberryBaseComponent from './flexberry-base-component';

/**
 * Menu item component for Semantic UI menus.
 *
 * Questions:
 * - Need {{yield}} in flexberry-menuitem.hbs?
 *
 * @class FlexberryMenuitem
 * @extends FlexberryBaseComponent
 */
export default FlexberryBaseComponent.extend({
  /**
   * Menu item content.
   *
   * item.title
   * item.icon [More icons](http://semantic-ui.com/elements/icon.html)
   * item.iconAlignment
   * item.items
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
    let subItems = this.get('item.items');
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
    let iconAlignment = this.get('item.iconAlignment');
    if (Ember.typeOf(iconAlignment) === 'string') {
      iconAlignment = iconAlignment.trim();
    }

    return iconAlignment === 'right' || iconAlignment === 'top';
  }),

  /**
   * Override component's wrapping element tag.
   * [More info.](http://emberjs.com/api/classes/Ember.Component.html#property_tagName)
   *
   * @property tagName
   * @type String
   * @default 'a'
   */
  tagName: 'a',

  /**
   * Array CSS class names.
   * [More info.](http://emberjs.com/api/classes/Ember.Component.html#property_classNames)
   *
   * @property classNames
   * @type Array
   * @readOnly
   */
  classNames: ['flexberry-menuitem', 'item'],

  /**
   * Path to component's settings in application configuration (JSON from ./config/environment.js).
   *
   * @property appConfigSettingsPath
   * @type String
   * @default 'APP.components.flexberryMenuItem'
   */
  appConfigSettingsPath: 'APP.components.flexberryMenuItem',

  /**
   * Initializes component.
   */
  init() {
    this._super(...arguments);

    // Override component's wrapping element for simple menu items.
    if (this.get('hasSubitems')) {
      this.set('tagName', 'div');

      let classNames = this.get('classNames');
      classNames.push(...['ui', 'simple', 'dropdown']);
    }
  },

  /**
   * Initializes DOM-related component's logic.
   */
  didInsertElement() {
    this._super(...arguments);

    // Store item object in DOM-element data attribute.
    // It will be used in root 'flexberry-menu' component to handle click on this 'flexberry-menuitem'.
    let item = this.get('item');
    this.$().data('flexberry-menuitem.item', item);
  },

  /**
   * Cleans up DOM-related component's logic.
   */
  willDestroyElement() {
    this._super(...arguments);

    // Remove stored item object from DOM-element data attribute.
    this.$().removeData('flexberry-menuitem.item');
  },
});
