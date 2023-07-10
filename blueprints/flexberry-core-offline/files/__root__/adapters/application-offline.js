import OfflineAdapter from 'ember-flexberry-data/adapters/offline';
import config from '../config/environment';

export default OfflineAdapter.extend({
  dbName: config.APP.offline.dbName,
});
