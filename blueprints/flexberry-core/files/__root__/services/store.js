import { Projection, Offline } from 'ember-flexberry-data';
import config from '../config/environment';

export default Offline.Store.reopen(Projection.StoreMixin, {
  init() {
    this.set('offlineSchema', {
      [config.APP.offline.dbName]: {
        // Paste your offline scheme here.
      }
    });
    return this._super(...arguments);
  }
});
