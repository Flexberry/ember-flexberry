/**
  @module ember-flexberry
 */

import Ember from 'ember';
import FlexberryFile from './../flexberry-file';

/**
  Mobile version of flexberry-file component (with mobile-specific defaults).

  @class Mobile.FlexberryFileComponent
  @extends FlexberryFileComponent
 */
export default FlexberryFile.extend({
  actions: {
    /**
      Handles click on menu item of selected file.

      @method actions.menuForFileItemClick
      @public

      @param {Object} e Information about selected menu item.
      @param {Object} [e.data] Data of selected menu item.
     */
    menuForFileItemClick(e) {
      // TODO: Move collapse menu logic into flexberry-menu component,
      // make it available through component setting (for example collapseMenuOnItemClick=true).
      this._collapseMenu();

      if (e.item.isZoomItem) {
        this.send('viewLoadedImage');

        return;
      }

      if (e.item.isReplaceItem) {
        let addButton = this.$('.flexberry-file-add-button');
        addButton.click();

        return;
      }

      if (e.item.isDeleteItem) {
        this.removeFile.call(this, null);

        return;
      }
    }
  },

  /**
    Components class names bindings.

    @property classNameBindings
    @type String[]
    @default ['isMobile:mobile']
   */
  classNameBindings: ['isMobile:mobile'],

  /**
    Flag: whether component is mobile or not.
    Used in base class for class names bindings.

    @property isMobile
    @type Boolean
    @default true
   */
  isMobile: true,

  /**
    Flag: indicates whether to show preview element for images or not.

    @property showPreview
    @type Boolean
    @default true
   */
  showPreview: true,

  /**
    Menu items for dropdown menu for selected image.

    @property menuForFileItems
    @type Object[]
    @readonly
   */
  menuForFileItems: Ember.computed('showPreview', 'readonly', 'i18n.locale', function() {
    let menuSubItems = [];
    if (this.get('showPreview')) {
      menuSubItems.push({
        icon: 'zoom icon',
        title: this.get('i18n').t('components.flexberry-file.menu-for-file.zoom-image-item-caption'),
        isZoomItem: true
      });
    }

    if (!this.get('readonly')) {
      menuSubItems.push({
        icon: 'file outline icon',
        title: this.get('i18n').t('components.flexberry-file.menu-for-file.replace-file-item-caption'),
        isReplaceItem: true
      });
    }

    if (!this.get('readonly')) {
      menuSubItems.push({
        icon: 'trash icon',
        title: this.get('i18n').t('components.flexberry-file.menu-for-file.delete-file-item-caption'),
        isDeleteItem: true
      });
    }

    return [{
      icon: 'list layout icon',
      itemsAlignment: undefined,
      items: menuSubItems
    }];
  }),

  /**
    Handles end of rerender.
    Dropdown part of menu is initialized here in order to get dropdown behavior,
    when menu disappeares after item selecting.
   */
  didRender() {
    this._super(...arguments);

    // TODO: Move collapse menu logic into flexberry-menu component,
    // make it available through component setting (for example collapseMenuOnItemClick=true),
    // and remove all didRender logic then.
    let dropdownElement = this.$('.flexberry-file-menu .dropdown');
    if (dropdownElement && dropdownElement.length > 0) {
      dropdownElement.dropdown();
    }
  },

  /**
    Collapses and clears menu after item selection.

    @method _collapseMenu
    @private
   */
  _collapseMenu() {
    let dropdownMenu = this.$('.flexberry-file-menu .dropdown');
    if (dropdownMenu && dropdownMenu.length > 0) {
      dropdownMenu.dropdown('clear');
    }
  }
});
