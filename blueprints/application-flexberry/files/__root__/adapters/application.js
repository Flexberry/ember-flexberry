import ODataAdapter from 'ember-flexberry/adapters/odata';
import Proj from 'ember-flexberry-projections';
import config from '../config/environment';
import AuthDataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';

export default ODataAdapter.extend(AuthDataAdapterMixin, Proj.Adapter, {
host: config.APP.backendUrls.api,
  authorizer: 'authorizer:custom'
}); 