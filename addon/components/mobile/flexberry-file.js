/**
  @module ember-flexberry
*/

import { computed  } from '@ember/object';
import FlexberryFile from './../flexberry-file';

/**
  Mobile version of {{#crossLink "FlexberryFileComponent"}}flexberry-file{{/crossLink}} component (with mobile-specific defaults).

  @class Mobile.FlexberryFileComponent
  @extends FlexberryFileComponent
*/
export default FlexberryFile.extend({
  /**
    Flag: whether component is mobile or not.
    Used in base class for class names bindings.

    @property _isMobile
    @type Boolean
    @default true
    @private
  */
  _isMobile: true,

  /**
    Items for component's menu.

    @readOnly
    @property _menuItems
    @type Object[]
    @private
  */
  _menuItems: computed('showPreview', 'readonly', 'i18n.locale', '_uploadButtonIsVisible', '_downloadButtonIsVisible', function() {
    let menuSubItems = [];
    if (this.get('showPreview')) {
      menuSubItems.push({
        icon: 'zoom icon',
        title: t('components.flexberry-file.menu-for-file.zoom-image-item-caption'),
        isZoomItem: true
      });
    }

    if (!this.get('readonly')) {
      menuSubItems.push({
        icon: 'file outline icon',
        title: t('components.flexberry-file.menu-for-file.replace-file-item-caption'),
        isReplaceItem: true
      });
    }

    if (!this.get('readonly')) {
      menuSubItems.push({
        icon: 'trash icon',
        title: t('components.flexberry-file.menu-for-file.delete-file-item-caption'),
        isDeleteItem: true
      });
    }
    if (this.get('_uploadButtonIsVisible')) {
      menuSubItems.push({
        icon: 'upload outline icon',
        title: t('components.flexberry-file.upload-button-title'),
        isUploadItem: true
      });
    }
    if (this.get('_downloadButtonIsVisible')) {
      menuSubItems.push({
        icon: 'download outline icon',
        title: t('components.flexberry-file.download-button-title'),
        isDownloadItem: true
      });
    }
    return [{
      icon: 'list layout icon',
      itemsAlignment: undefined,
      items: menuSubItems
    }];
  }),

  actions: {
    /**
      Handles click on menu item of selected file.

      @method actions.onMenuItemClick
      @param {Object} e Information about selected menu item.
      @param {Object} [e.data] Data of selected menu item.
      @public
    */
    onMenuItemClick(e) {
      if (!e.item) {
        return;
      }

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
        this.removeFile();

        return;
      }

      if (e.item.isDownloadItem) {
        this.downloadFile();

        return;
      }

      if (e.item.isUploadItem){
        this.uploadFile();

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
  classNameBindings: ['_isMobile:mobile'],

  /**
    Flag: indicates whether to show preview element for images or not.

    @property showPreview
    @type Boolean
    @default true
  */
  showPreview: true,

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
});
