import Ember from 'ember';
import BaseAuthenticator from 'ember-simple-auth/authenticators/base';

export default BaseAuthenticator.extend({
  tokenEndpoint: null,

  restore: function(data) {
    return new Ember.RSVP.Promise(function(resolve, reject) {
      if (!Ember.isEmpty(data.token)) {
        resolve(data);
      } else {
        reject();
      }
    });
  },

  // Аутентификация с запросом к серверу и получение соответствующего token.
  authenticate: function(identification, password) {
    Ember.assert('tokenEndpoint should be defined', this.tokenEndpoint);

    return new Ember.RSVP.Promise((resolve, reject) => {
      Ember.$.ajax({
        url: this.tokenEndpoint,
        type: 'POST',
        data: `username=${identification}&password=${password}&grant_type=password`,
        contentType: 'text/plain'
      }).then(function(response) {
        Ember.run(function() {
          resolve({
            // FIXME: need for requirePaddingNewLinesBeforeLineComments due to https://github.com/jscs-dev/node-jscs/issues/1313.
            // jscs:disable requireCamelCaseOrUpperCaseIdentifiers, requirePaddingNewLinesBeforeLineComments
            // Reason: access_token is standard parameter for OAuth2.
            token: response.access_token,
            // jscs:enable requireCamelCaseOrUpperCaseIdentifiers, requirePaddingNewLinesBeforeLineComments

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
    Ember.assert('tokenEndpoint should be defined', this.tokenEndpoint);

    return new Ember.RSVP.Promise((resolve) => {
      Ember.$.ajax({ url: this.tokenEndpoint, type: 'DELETE' }).always(function() {
        resolve();
      });
    });
  }
});
