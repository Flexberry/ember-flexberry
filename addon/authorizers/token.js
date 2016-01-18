import Ember from 'ember';
import BaseAuthorizer from 'ember-simple-auth/authorizers/base';

export default BaseAuthorizer.extend({
  authorize: function(data, block) {
    let token = data.token;
    if (!Ember.isEmpty(token)) {
      block('Authorization', 'Bearer ' + token);
    }
  }
});
