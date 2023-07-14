/**
 * @module ember-flexberry
 */

import Service from '@ember/service';
import Evented from '@ember/object/evented';

/**
 * Service to work with column configuration menu
 *
 * @class ColsConfigMenuService
 * @extends Service
 * @public
 */
export default Service.extend(Evented, {
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
