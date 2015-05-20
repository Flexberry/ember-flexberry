import CustomAuthenticator from '../authenticators/custom';
import CustomAuthorizer from '../authorizers/custom';

export function initialize(container, application) {
  container.register('authenticator:custom', CustomAuthenticator);
  container.register('authorizer:custom', CustomAuthorizer);
}

// TODO: it is necessary or not in the ember-cli?
export default {
  name: 'authentication',
  before: 'simple-auth',
  initialize: initialize
};
