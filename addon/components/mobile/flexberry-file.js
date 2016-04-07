/**
 * @module ember-flexberry
 */

import Ember from 'ember';
import FlexberryFile from './../flexberry-file';

/**
 * Mobile version of flexberry-file (with mobile-specific defaults).
 */
export default FlexberryFile.extend({
  /**
   * Flag: indicates whether to use single column to display all model properties or not.
   *
   * @property useSingleColumn
   * @type Boolean
   * @default false
   */
  addButtonText: '',

  /**
   * Flag: indicates whether to show preview element for images or not.
   *
   * @property showPreview
   * @type Boolean
   * @default true
   */
  showPreview: true,

  /**
   * Computed property indicates if there is info about selected file to preview it.
   *
   * @property hasSelectedFile
   * @type Boolean
   * @default false
   */
  hasSelectedFile: Ember.computed('_selectedFileSrc', function() {
    var selectedFileSrc = this.get('_selectedFileSrc');
    return selectedFileSrc && selectedFileSrc !== '';
  }),

  /**
   * Init control, set current text for add file button.
   *
   * @method init
   * @public
   */
  init: function() {
    this._super(...arguments);
    var i18n = this.get('i18n');
    let currentName = this.get('addButtonText');
    if (!currentName) {
      this.set('addButtonText', i18n.t('flexberry-file.add-btn-text'));
    }

    // TODO: move to base mobile component.
    let currentClasses = this.get('classNames');
    if (currentClasses && Ember.isArray(currentClasses) && currentClasses.length > 0) {
      currentClasses.push('mobile');
    } else {
      currentClasses = ['mobile'];
    }

    this.set('classNames', currentClasses);
  },

  /**
   * This method handles end of rerender.
   * Dropdown part of menu is initialized here in order to get dropdown behavior,
   * when menu disappeares after item selecting.
   *
   * @method didRender
   * @public
   */
  didRender() {
    this._super(...arguments);
    let dropdownElement = this.$('.flexberry-file-image-preview-menu-mobile .dropdown');
    if (dropdownElement && dropdownElement.length > 0) {
      dropdownElement.dropdown();
    }
  },

  /**
   * Menu items for dropdown menu for selected image.
   *
   * @property menuForFileItems
   * @type Object[]
   * @readonly
   */
  menuForFileItems: Ember.computed(
    'showPreview',
    function() {
      var menuSubItems = [];
      if (this.get('showPreview')) {
        menuSubItems.push({
          icon: 'zoom icon',
          title: this.get('i18n').t('flexberry-file.menu-for-file.zoom-image-item-title') || 'Zoom image',
          isZoomItem: true
        });

        if (this.get('addButtonIsVisible')) {
          menuSubItems.push({
            icon: 'file outline icon',
            title: this.get('i18n').t('flexberry-file.menu-for-file.replace-file-item-title') || 'Replace file',
            isReplaceItem: true
          });
        }

        menuSubItems.push({
          icon: 'trash icon',
          title: this.get('i18n').t('flexberry-file.menu-for-file.delete-file-item-title') || 'Delete file',
          isDeleteItem: true
        });
      }

      return [{
        icon: 'list layout icon',
        itemsAlignment: undefined,
        items: menuSubItems
      }];
    }
  ),

  actions: {
    /**
     * This method handles click on menu item of selected file.
     *
     * @method menuForFileItemClick
     * @public
     *
     * @param {Object} e Information about selected menu item.
     * @param {Object} [e.data] Data of selected menu item.
     */
    menuForFileItemClick: function(e) {
      if (this.get('readonly')) {
        return;
      }

      if (e.item.isZoomItem) {
        this.send('viewLoadedImage');
        this._collapseMenu();
        return;
      }

      if (e.item.isReplaceItem) {
        let addButton = this.$('.flexberry-file-add-button');
        if (!addButton || addButton.length === 0) {
          throw new Error('Add file button not found.');
        }

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
   * This method collapses and clears menu after item selection.
   *
   * @method _collapseMenu
   * @private
   */
  _collapseMenu: function() {
    let dropdownElement = this.$('.flexberry-file-image-preview-menu-mobile .dropdown');
    if (dropdownElement && dropdownElement.length > 0) {
      dropdownElement.dropdown('clear');
    }
  }
});
