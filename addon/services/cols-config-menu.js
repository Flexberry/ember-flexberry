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
export default Ember.Service.extend({
    menus: [
      { name: 'use', title: 'Применить', icon: 'checkmark box' },
      { name: 'edit', title: 'Редактировать', icon: 'setting' },
      { name: 'remove', title: 'Удалить', icon: 'remove' }
    ],

    colsSettingsItems: [{
      icon: 'dropdown icon',
      iconAlignment: 'right',
      title: '',
      items: [{
        icon: 'table icon',
        iconAlignment: 'left',
        title: 'Создать настройку'
      }]
    }],

    reset: function(listNamedSettings) {
      let items = this.colsSettingsItems[0].items;
      if (listNamedSettings.length > 0) {
        let menus = this.menus;
        for (let menu in menus) {
          let submenu = { icon: 'angle right icon', iconAlignment: 'right', title: menus[menu].title, items: [] };
          items[items.length] = submenu;
        }

        for (let i = 0; i < listNamedSettings.length; i++) {
          this.addNamedSetting(listNamedSettings[i]);
        }

        this.sort();
      }

      items[items.length] = {
        icon: 'remove circle icon',
        iconAlignment: 'left',
        title: 'Сбросить настройку'
      };
      return this.colsSettingsItems;
    },

    addNamedSetting: function(namedSeting) {
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

    },

    deleteNamedSetting: function(namedSeting) {
      let menus = this.menus;
      for (let i = 0; i < menus.length; i++) {
        let subItems = this.colsSettingsItems[0].items[i + 1].items;
        let newSubItems = [];
        for (let j = 0; j < subItems.length; j++) {
          if (subItems[j].title !== namedSeting) {
            newSubItems[newSubItems.length] = subItems[j];
          }

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
