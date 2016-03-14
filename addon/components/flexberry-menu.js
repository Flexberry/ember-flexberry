/**
 * @module ember-flexberry
 */

import Ember from 'ember';
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
   * Flag: indicates whether to call 'items.[].onClick' callbacks or not.
   *
   * @property callItemsOnClickCallbacks
   * @type Boolean
   * @default true
   */
  callItemsOnClickCallbacks: true,

  /**
   * Initializes component.
   */
  init: function() {
    this._super(...arguments);
  },

  /**
   * Initializes DOM-related component's logic.
   */
  didInsertElement: function() {
    this._super(...arguments);

    // Bind right context to menu click event handler.
    var onClickHandler = this.get('_onClickHandler').bind(this);
    this.set('_onClickHandler', onClickHandler);

    // Attach menu click event handler.
    this.$().on('click', onClickHandler);
  },

  /**
   * Cleans up DOM-related component's logic.
   */
  willDestroyElement: function() {
    this._super(...arguments);

    // Remove menu item click event handler.
    var onClickHandler = this.get('_onClickHandler');
    this.$().off('click', onClickHandler);
  },

  /**
   * Menu click handler.
   * Used to delegate menu items clicks handling.
   *
   * @method _onClickHandler
   * @param e Click event object.
   * @private
   */
  _onClickHandler: function(e) {
    // Find clicked menu item element.
    var itemElement = Ember.$(e.target);
    if (!itemElement.hasClass('flexberry-menuitem')) {
      itemElement = itemElement.parents('.flexberry-menuitem');
    }

    // Replace currentTarget with clicked menu item element.
    e.currentTarget = itemElement[0];

    // Add clicked item's content to click event object.
    var item = itemElement.data('flexberry-menuitem.item');
    e.item = item;

    // Call onClick handler if it is specified in the given menu item.
    if (item && Ember.typeOf(item.onClick) === 'function' && this.get('callItemsOnClickCallbacks')) {
      item.onClick.call(e.currentTarget, e);
    }

    // Send 'onClick' action on clicked 'flexberry-menuitem' component.
    this.sendAction('onItemClick', e);
  }
});
