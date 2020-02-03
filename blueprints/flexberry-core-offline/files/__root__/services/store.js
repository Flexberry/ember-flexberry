import { Projection, Offline } from 'ember-flexberry-data';
import config from '../config/environment';
import Ember from 'ember';

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
      [config.APP.offline.dbName]: { 1: this.get('offlineGlobals').getOfflineSchema() },
    });
    return this._super(...arguments);
  }
});
