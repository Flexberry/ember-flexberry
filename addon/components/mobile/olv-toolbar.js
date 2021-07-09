/**
  @module ember-flexberry
*/

import { A } from '@ember/array';
import { computed } from '@ember/object';
import OlvToolbar from '../olv-toolbar';

export default OlvToolbar.extend({
  /**
    @property advLimitItems
    @readOnly
  */
  advLimitItems: computed('i18n.locale', 'advLimit.isAdvLimitServiceEnabled', 'namedAdvLimits', function() {
    const i18n = this.get('i18n');
    const rootItem = {
      icon: 'large flask icon',
      iconAlignment: 'left',
      title: '',
      items: A(),
      localeKey: ''
    };
    const createLimitItem = {
      icon: 'flask icon',
      iconAlignment: 'left',
      title: i18n.t('components.olv-toolbar.create-limit-title'),
      localeKey: 'components.olv-toolbar.create-limit-title'
    };
    rootItem.items.addObject(createLimitItem);

    const limitItems = this.get('namedAdvLimits');
    const menus = this.get('menus');
    const editMenus = A();
    menus.forEach(menu => {
      const menuSubitem = this._createMenuSubitems(limitItems, menu.icon + ' icon');
      if (menuSubitem.length > 0) {
        editMenus.addObject({
          icon: 'angle right icon',
          iconAlignment: 'right',
          localeKey: `components.olv-toolbar.${menu.name}-limit-title`,
          items: menuSubitem
        });
      }
    }, this);

    if (editMenus.length > 0) {
      rootItem.items.addObjects(editMenus);
    }

    const setDefaultItem = {
      icon: 'remove circle icon',
      iconAlignment: 'left',
      title: i18n.t('components.olv-toolbar.set-default-limit-title'),
      localeKey: 'components.olv-toolbar.set-default-limit-title'
    };
    rootItem.items.addObject(setDefaultItem);

    return this.get('advLimit.isAdvLimitServiceEnabled') ? A([rootItem]) : A();
  }),

  /**
    @property exportExcelItems
    @readOnly
  */
  exportExcelItems: computed(function() {
      let i18n = this.get('i18n');
      let menus = [
        {
          icon: 'file excel outline icon',
          iconAlignment: 'left',
          title: i18n.t('components.olv-toolbar.create-setting-title'),
          localeKey: 'components.olv-toolbar.create-setting-title'
        },
        { icon: 'angle right icon',
          iconAlignment: 'right',
          localeKey: 'components.olv-toolbar.export-title',
          items: []
        },
        { icon: 'angle right icon',
          iconAlignment: 'right',
          localeKey: 'components.olv-toolbar.edit-setting-title',
          items: []
        },
        { icon: 'angle right icon',
          iconAlignment: 'right',
          localeKey: 'components.olv-toolbar.remove-setting-title',
          items: []
        }
      ];
      let rootItem = {
        icon: 'large file excel outline icon',
        iconAlignment: 'right',
        items: [],
        localeKey: ''
      };

      rootItem.items.push(...menus);

      return [rootItem];
    }
  ),

  /**
    @property colsSettingsItems
    @readOnly
  */
  colsSettingsItems: computed('i18n.locale', 'userSettingsService.isUserSettingsServiceEnabled', function() {
      let i18n = this.get('i18n');
      let menus = [
        {
          icon: 'table icon',
          iconAlignment: 'left',
          title: i18n.t('components.olv-toolbar.create-setting-title'),
          localeKey: 'components.olv-toolbar.create-setting-title'
        },
        { icon: 'angle right icon',
          iconAlignment: 'right',
          localeKey: 'components.olv-toolbar.use-setting-title',
          items: []
        },
        { icon: 'angle right icon',
          iconAlignment: 'right',
          localeKey: 'components.olv-toolbar.edit-setting-title',
          items: []
        },
        { icon: 'angle right icon',
          iconAlignment: 'right',
          localeKey: 'components.olv-toolbar.remove-setting-title',
          items: []
        }
      ];
      let rootItem = {
        icon: 'large table icon',
        iconAlignment: 'left',
        title: '',
        items: [],
        localeKey: ''
      };

      rootItem.items.push(...menus);

      let setDefaultItem = {
        icon: 'remove circle icon',
        iconAlignment: 'left',
        title: i18n.t('components.olv-toolbar.set-default-setting-title'),
        localeKey: 'components.olv-toolbar.set-default-setting-title'
      };
      rootItem.items[rootItem.items.length] = setDefaultItem;
      if (this.get('colsConfigMenu').environment && this.get('colsConfigMenu').environment === 'development') {
        let showDefaultItem = {
          icon: 'unhide icon',
          iconAlignment: 'left',
          title: i18n.t('components.olv-toolbar.show-default-setting-title'),
          localeKey: 'components.olv-toolbar.show-default-setting-title'
        };
        rootItem.items[rootItem.items.length] = showDefaultItem;
      }

      return this.get('userSettingsService').isUserSettingsServiceEnabled ? [rootItem] : [];
    }
  )
});
