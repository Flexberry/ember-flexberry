import { Adapter } from 'ember-flexberry-data';
import config from '../config/environment';

export default Adapter.Offline.extend({
  dbName: config.APP.offline.dbName,
});
