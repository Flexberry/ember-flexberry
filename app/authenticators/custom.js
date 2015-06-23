import Ember from 'ember';
import BaseAuthenticator from 'simple-auth/authenticators/base';

export default BaseAuthenticator.extend({

  tokenEndpoint: 'https://northwindodata.azurewebsites.net/Token',
  //tokenEndpoint: 'http://localhost:1180/Token',

  restore: function(data) {
    return new Ember.RSVP.Promise(function(resolve, reject) {
      if (!Ember.isEmpty(data.token)) {
        resolve(data);
      } else {
        reject();
      }
    });
  },

  // аутентификация с запросом к серверу и получение соответствующего token.
  authenticate: function(credentials) {
    var url = this.tokenEndpoint;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      Ember.$.ajax({
        url: url,
        type: 'POST',
        data: `username=${credentials.identification}&password=${credentials.password}&grant_type=password`,
        contentType: 'text/plain'
      }).then(function(response) {
        Ember.run(function() {
          resolve({
            token: response.access_token,
            userName: response.userName
          });
        });
      }, function(xhr) {
        var xhrJson = JSON.parse(xhr.responseText);
        Ember.run(function() {
          reject(xhrJson);
        });
      });
    });
  },

  invalidate: function() {
    var _this = this;
    return new Ember.RSVP.Promise(function(resolve) {
      Ember.$.ajax({ url: _this.tokenEndpoint, type: 'DELETE' }).always(function() {
        resolve();
      });
    });
  }
});
