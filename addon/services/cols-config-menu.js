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
  addNamedSettingTrigger(namedSetting) {
    this.trigger('addNamedSetting', namedSetting);
  },

  deleteNamedSettingTrigger(namedSetting) {
    this.trigger('deleteNamedSetting', namedSetting);
  },

  updateNamedSettingTrigger() {
    this.trigger('updateNamedSetting');
  },
});
