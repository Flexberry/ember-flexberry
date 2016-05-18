import ODataAdapter from 'ember-flexberry/adapters/odata';
import Proj from 'ember-flexberry-data';
import config from '../config/environment';

export default ODataAdapter.extend(Proj.Adapter, {
  host: config.APP.backendUrl
});
