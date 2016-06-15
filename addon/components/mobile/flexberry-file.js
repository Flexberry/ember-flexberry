/**
 * @module ember-flexberry
 */

import Ember from 'ember';
import FlexberryFile from './../flexberry-file';

/**
  Mobile version of flexberry-file (with mobile-specific defaults).
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
      if (this.get('readonly')) {
        return;
      }

      // TODO: Move collapse menu logic into flexberry-menu component,
      // make it available through component setting (for example collapseMenuOnItemClick=true).
      if (e.item.isZoomItem) {
        this.send('viewLoadedImage');
        this._collapseMenu();

        return;
      }

      if (e.item.isReplaceItem) {
        let addButton = this.$('.flexberry-file-add-button');
        addButton.click();
        this._collapseMenu();

        return;
      }

      if (e.item.isDeleteItem) {
        this.removeFile.call(this, null);
        this._collapseMenu();

        return;
      }
    }
  },

  /**
    Components class names bindings.
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
    Computed property indicates if there is info about selected file to preview it.

    @property hasSelectedFile
    @type Boolean
    @default false
   */
  hasSelectedFile: Ember.computed('_selectedFileSrc', function() {
    var selectedFileSrc = this.get('_selectedFileSrc');
    return selectedFileSrc && !Ember.isBlank(selectedFileSrc);
  }),

  /**
    Menu items for dropdown menu for selected image.

    @property menuForFileItems
    @type Object[]
    @readonly
   */
  menuForFileItems: Ember.computed('showPreview', 'i18n.locale', function() {
    var menuSubItems = [];
    if (this.get('showPreview')) {
      menuSubItems.push({
        icon: 'zoom icon',
        title: this.get('i18n').t('components.flexberry-file.menu-for-file.zoom-image-item-caption'),
        isZoomItem: true
      });

      if (this.get('addButtonIsVisible')) {
        menuSubItems.push({
          icon: 'file outline icon',
          title: this.get('i18n').t('components.flexberry-file.menu-for-file.replace-file-item-caption'),
          isReplaceItem: true
        });
      }

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
    This method handles end of rerender.
    Dropdown part of menu is initialized here in order to get dropdown behavior,
    when menu disappeares after item selecting.

    @method didRender
    @public
   */
  didRender() {
    this._super(...arguments);

    // TODO: Move collapse menu logic into flexberry-menu component,
    // make it available through component setting (for example collapseMenuOnItemClick=true),
    // and remove all didRender logic then.
    let dropdownElement = this.$('.flexberry-file-image-preview-menu-mobile .dropdown');
    if (dropdownElement && dropdownElement.length > 0) {
      dropdownElement.dropdown();
    }
  },

  /**
    This method collapses and clears menu after item selection.

    @method _collapseMenu
    @private
   */
  _collapseMenu() {
    let dropdownMenu = this.$('.flexberry-file-image-preview-menu-mobile .dropdown');
    if (dropdownMenu && dropdownMenu.length > 0) {
      dropdownMenu.dropdown('clear');
    }
  }
});
