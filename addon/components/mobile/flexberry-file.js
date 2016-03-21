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
   * Computed property indicates if file is selected.
   *
   * @property hasSelectedFile
   * @type Boolean
   * @default false
   */
  hasSelectedFile: Ember.computed('selectedFile', function() {
    var selectedFile = this.get('selectedFile');
    return !!(selectedFile);
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
        itemsAlignment: 'left',
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
        return;
      }

      if (e.item.isReplaceItem) {
        let addButton = this.$('.flexberry-file-add-button');
        if (!addButton || addButton.length === 0) {
          throw new Error('Add file button not found.');
        }

        addButton.click();
        return;
      }

      if (e.item.isDeleteItem) {
        this.removeFile.call(this, null);
        return;
      }
    }
  }
});
