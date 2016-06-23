/**
 * @module ember-flexberry
 */

import Ember from 'ember';
/**
 * Service to work with column configuration menu
 *
 * @class DetailInterationService
 * @extends Ember.Service
 * @public
 */
export default Ember.Service.extend(Ember.Evented, {
    menus: [
      { name: 'use', icon: 'checkmark box' },
      { name: 'edit', icon: 'setting' },
      { name: 'remove', icon: 'remove' }
    ],

    colsSettingsItems: undefined,

    listNamedSettings: undefined,

    addNamedSettingTrigger: function (namedSeting) {
      this.trigger('addNamedSetting', namedSeting);
    },

    deleteNamedSettingTrigger: function (namedSeting) {
      this.trigger('deleteNamedSetting', namedSeting);
    },

    resetMenu: function(params) {
      let itemsAlignment = window.innerWidth < 720 ? 'left' : 'right';
      let rootItem = {
        icon: 'dropdown icon',
        iconAlignment: 'right',
        title: '',
        itemsAlignment: itemsAlignment,
        items:[]
      };
      let createSettitingItem = {
        icon: 'table icon',
        iconAlignment: 'left',
        title: params.createSettitingTitle
      };
      rootItem.items[rootItem.items.length] = createSettitingItem;
      for (let n in this.menus) {
        let menu = this.menus[n];
        let titleName = menu.name + 'SettitingTitle';
        let title = params[titleName];
        let submenu = { icon: 'angle right icon', iconAlignment: 'right', title: title, itemsAlignment:itemsAlignment, items: [] };
        rootItem.items[rootItem.items.length] = submenu;
      }

      let setDefaultItem = {
        icon: 'remove circle icon',
        iconAlignment: 'left',
        title: params.setDefaultSettitingTitle
      };
      rootItem.items[rootItem.items.length] = setDefaultItem;
      this.colsSettingsItems = [rootItem];
      this.listNamedSettings = params.listNamedSettings;
      for (let namedSetting in this.listNamedSettings) {
        this._addNamedSetting(namedSetting);
      }

      this.sort();
      return this.colsSettingsItems;
    },

    _addNamedSetting: function(namedSeting) {
      let menus = this.menus;
      for (let i = 0; i < menus.length; i++) {
        let icon = menus[i].icon + ' icon';
        let subItems = this.colsSettingsItems[0].items[i + 1].items;
        let newSubItems = [];
        let exist = false;
        for (let j = 0; j < subItems.length; j++) {
          newSubItems[j] = subItems[j];
          if (subItems[j].title === namedSeting) {
            exist = true;
          }

        }

        if (!exist) {
          newSubItems[subItems.length] = { title: namedSeting, icon: icon, iconAlignment: 'left' };
        }

        Ember.set(this.colsSettingsItems[0].items[i + 1], 'items', newSubItems);
      }

      this.sort();
    },

    sort: function() {
      for (let i = 0; i < this.menus.length; i++) {
        this.colsSettingsItems[0].items[i + 1].items.sort((a, b) => a.title > b.title);
      }
    }

  }
);
