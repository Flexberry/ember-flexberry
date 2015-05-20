import Ember from 'ember';
import BaseAuthorizer from 'simple-auth/authorizers/base';

export default BaseAuthorizer.extend({
  authorize: function(jqXHR, requestOptions) {
    var token = this.get('session.token');
    if (this.get('session.isAuthenticated') && !Ember.isEmpty(token)) {
      jqXHR.setRequestHeader('x-authentication-token', token);
    }
  }
});
