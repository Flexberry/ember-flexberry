import { Projection, Offline } from 'ember-flexberry-data';
import config from '../config/environment';

export default Offline.Store.reopen(Projection.StoreMixin, {
  /**
   Service that return offline schemas.

   @property objectlistviewEventsService
   @type {Class}
   @default OfflineGlobalsService
  */
  offlineGlobals: Ember.inject.service('offline-globals'),

  init() {
    this.set('offlineSchema', {
      [config.APP.offline.dbName]: {
        offlineGlobals.getOfflineSchema();
      }
    });
    return this._super(...arguments);
  }
});
