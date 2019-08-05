/**
 * @module ember-flexberry
 */

import Ember from 'ember';

/**
 * Service to work with column configuration menu
 *
 * @class ColsConfigMenuService
 * @extends Ember.Service
 * @public
 */
export default Ember.Service.extend(Ember.Evented, {
  addNamedSettingTrigger(namedSetting, componentName) {
    this.trigger('addNamedSetting', namedSetting, componentName);
  },

  deleteNamedSettingTrigger(namedSetting, componentName) {
    this.trigger('deleteNamedSetting', namedSetting, componentName);
  },

  updateNamedSettingTrigger(componentName) {
    this.trigger('updateNamedSetting', componentName);
  },

  updateNamedAdvLimitTrigger(componentName) {
    this.trigger('updateNamedAdvLimit', componentName);
  },
});
