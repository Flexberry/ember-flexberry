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
  items: null,

  /**
   * Hook which will be called to configure menu items.
   *
    Example:
    ```handlebars
    <!-- app/templates/menu.hbs -->
    {{flexberry-menu
      ...
      configurateItems=(action 'configurateItems')
      ...
    }}
    ```

    ```js
    // app/controllers/menu.js

    export default Ember.Controller.extend({
      actions: {
        configurateItems: function(menuItems) {
          menuItems.push({
            icon: 'edit icon',
            title: 'Edit'
          }, {
            icon: 'trash icon',
            title: 'Delete'
          });
        }
      }
    });
    ```
   * @method configurateItems
   * @param {Array} items Menu items array.
   */
  configurateItems: undefined,

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

    // Component properties will be defined in class prototype,
    // so complex properties like object or arrays, will be shared between all class instances,
    // that's why such properties should be initialized manually in 'init' method.
    var items = this.get('items');
    if (Ember.isNone(items)) {
      items = [];
    }

    // Call to 'configurateItems' hook.
    let configurateItems = this.get('configurateItems');

    if (configurateItems) {
      let configurateItemsType = Ember.typeOf(configurateItems);

      if (configurateItemsType === 'function') {
        configurateItems(items);
      } else {
        Ember.Logger.error(
          'Wrong type of flexberry-menu \'configurateItems\' propery: ' +
          'actual type is \'' +
          configurateItemsType +
          '\', but \'function\' is expected.');
      }
    }

    this.set('items', items);
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
