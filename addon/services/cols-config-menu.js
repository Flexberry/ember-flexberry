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
