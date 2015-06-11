import CustomAuthenticator from '../authenticators/custom';
import CustomAuthorizer from '../authorizers/custom';

export default {
  name: 'authentication',
  before: 'simple-auth',
  initialize: function (container) {
    container.register('authorizer:custom', CustomAuthorizer);
    container.register('authenticator:custom', CustomAuthenticator);
  }
};
