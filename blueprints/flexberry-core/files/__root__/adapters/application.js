import AdapterMixin from 'ember-flexberry-data/mixins/adapter';
import OdataAdapter from 'ember-flexberry-data/adapters/odata';
import config from '../config/environment';

export default OdataAdapter.extend(AdapterMixin, {
  host: config.APP.backendUrls.api,
});
