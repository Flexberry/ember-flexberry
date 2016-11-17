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
