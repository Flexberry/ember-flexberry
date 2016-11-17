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
    /**
      Current application environment.

      @property environment
      @type String
    */
    environment: undefined,

    menus: [
      { name: 'use', icon: 'checkmark box' },
      { name: 'edit', icon: 'setting' },
      { name: 'remove', icon: 'remove' }
    ],

    colsSettingsItems: undefined,

    listNamedSettings: undefined,

    addNamedSettingTrigger: function (namedSetting) {
      this.trigger('addNamedSetting', namedSetting);
    },

    deleteNamedSettingTrigger: function (namedSetting) {
      this.trigger('deleteNamedSetting', namedSetting);
    },

    _addNamedSetting: function(namedSetting) {
      let menus = this.menus;
      for (let i = 0; i < menus.length; i++) {
        let icon = menus[i].icon + ' icon';
        let subItems = this.colsSettingsItems[0].items[i + 1].items;
        let newSubItems = [];
        let exist = false;
        for (let j = 0; j < subItems.length; j++) {
          newSubItems[j] = subItems[j];
          if (subItems[j].title === namedSetting) {
            exist = true;
          }

        }

        if (!exist) {
          newSubItems[subItems.length] = { title: namedSetting, icon: icon, iconAlignment: 'left' };
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
