/**
 * @module ember-flexberry
 */

import Ember from 'ember';
import FlexberryMenuComponent from './flexberry-menu';
import FlexberryBaseComponent from './flexberry-base-component';

/**
 * Menu item component for Semantic UI menus.
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

    // Find and remember root 'flexberry-menu' component (which contains this menu item).
    var rootMenuComponent = this.getTargetObjectByCondition(function(targetObject) {
      return targetObject instanceof FlexberryMenuComponent;
    });
    this.set('_rootMenuComponent', rootMenuComponent);
  },

  /**
   * Initializes DOM-related component's logic.
   */
  didInsertElement: function() {
    this._super(...arguments);

    // Bind right context to click event handler.
    var onClickHandler = this.get('_onClickHandler').bind(this);
    this.set('_onClickHandler', onClickHandler);

    // Attach click event handler.
    this.$().on('click', onClickHandler);
  },

  /**
   * Cleans up DOM-related component's logic.
   */
  willDestroyElement: function() {
    this._super(...arguments);

    // Remove click event handler.
    var onClickHandler = this.get('_onClickHandler');
    this.$().off('click', onClickHandler);
  },

  /**
   * Root flexberry-menu component (which contains this menu item).
   *
   * @property _rootMenuComponent
   * @type FlexberryMenuComponent
   * @private
   */
  _rootMenuComponent: null,

  /**
   * Menu item click handler.
   * @method _onClickHandler
   * @param e Click event object.
   * @private
   */
  _onClickHandler: function(e) {
    // Stop event bubbling.
    e.stopPropagation();

    // Add clicked item's content to click event object.
    var item = this.get('item');
    e.item = item;

    // // Add clicked item's related model to click event object.
    var model = this.get('relatedModel');
    e.model = model;

    // Call onClick handler if it is specified in the given menu item.
    if (item && Ember.typeOf(item.onClick) === 'function') {
      item.onClick.call(e.currentTarget, e);
    }

    // Send 'onClick' action on clicked 'flexberry-menuitem' component.
    this.sendAction('onClick', e);

    // Send 'onItemClick' action on root 'flexberry-menu' component.
    var rootMenuComponent = this.get('_rootMenuComponent');
    if (rootMenuComponent && rootMenuComponent.sendAction) {
      rootMenuComponent.sendAction('onItemClick', e);
    }
  }
});
