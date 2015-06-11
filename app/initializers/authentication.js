import CustomAuthenticator from '../authenticators/custom';
import CustomAuthorizer from '../authorizers/custom';

export function initialize(container) {
  container.register('authenticator:custom', CustomAuthenticator);
  container.register('authorizer:custom', CustomAuthorizer);
}

export default {
  name: 'authentication',
  before: 'simple-auth',
  initialize: initialize
};
