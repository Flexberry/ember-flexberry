import Ember from 'ember';
import BaseAuthorizer from 'simple-auth/authorizers/base';

export default BaseAuthorizer.extend({
  authorize: function(jqXHR) {
    var session = this.get('session');
    var secure = session.get('secure');
    if (session.get('isAuthenticated') && !Ember.isEmpty(secure.token)) {
      jqXHR.setRequestHeader('Authorization', 'Bearer ' + secure.token);
    }
  }
});
