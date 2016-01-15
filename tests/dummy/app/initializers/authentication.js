import CustomAuthenticator from '../authenticators/custom';
import CustomAuthorizer from '../authorizers/custom';

export function initialize(application) {
  application.register('authenticator:custom', CustomAuthenticator);
  application.register('authorizer:custom', CustomAuthorizer);
}

export default {
  name: 'authentication',
  before: 'simple-auth',
  initialize: initialize
};
