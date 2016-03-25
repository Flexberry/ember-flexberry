import TokenAuthenticator from 'ember-flexberry/authenticators/token';
import config from '../config/environment';

export default TokenAuthenticator.extend({
tokenEndpoint: config.APP.backendUrls.authToken
}); 
