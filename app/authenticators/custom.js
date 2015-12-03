import TokenAuthenticator from './token';
import config from '../config/environment';

export default TokenAuthenticator.extend({
  tokenEndpoint: config.APP.backendUrls.authToken
});
