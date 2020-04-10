import BaseStore from 'ember-flexberry-data/stores/base-store';
import StoreMixin from 'ember-flexberry-data/mixins/store';
import config from '../config/environment';
import { inject as service } from '@ember/service';

export default BaseStore.reopen(StoreMixin, {
  /**
   Service that return offline schemas.

   @property objectlistviewEventsService
   @type {Class}
   @default OfflineGlobalsService
  */
  offlineGlobals: service('offline-globals'),

  init() {
    this.set('offlineSchema', {
      [config.APP.offline.dbName]: { 1: this.get('offlineGlobals').getOfflineSchema() },
    });
    return this._super(...arguments);
  }
});
