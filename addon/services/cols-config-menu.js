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
  addNamedSettingTrigger(namedSetting, componentName, isExportExcel) {
    this.trigger('addNamedSetting', namedSetting, componentName, isExportExcel);
  },

  deleteNamedSettingTrigger(namedSetting, componentName, isExportExcel) {
    this.trigger('deleteNamedSetting', namedSetting, componentName, isExportExcel);
  },

  updateNamedSettingTrigger(componentName, isExportExcel) {
    this.trigger('updateNamedSetting', componentName, isExportExcel);
  },

  updateNamedAdvLimitTrigger(componentName) {
    this.trigger('updateNamedAdvLimit', componentName);
  },
});
