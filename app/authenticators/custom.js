import Ember from 'ember';
import BaseAuthenticator from 'simple-auth/authenticators/base';

export default BaseAuthenticator.extend({
    restore: function(data) {
        return new Ember.RSVP.Promise(function(resolve, reject) {
            if (!Ember.isEmpty(data.token)) {
                resolve(data);
            } else {
                reject();
            }
        });
    },

    // Локальная аутентификация без запроса к серверу и локальной генерацией token.
    authenticate: function(credentials) {
        return new Ember.RSVP.Promise(function(resolve, reject) {
            if (credentials && credentials.identification === 'ember' && credentials.password === 'ember') {
                var token = function() {
                    return Math.random().toString(36).substr(2); // remove `0.
                };

                Ember.run(function() {
                    resolve({ token: token() });
                });
            }
            else {
                Ember.run(function() {
                    reject(new Error("Некорректный пароль"));
                });
            }
        });
    }

    /*
     // Аутентификация с запросом к серверу и получение соответствующего token.
    tokenEndpoint: 'http://localhost:64877/WebServiceLogin.asmx/LoginUser',
    authenticate: function(credentials) {
        var _this = this;
        return new Ember.RSVP.Promise(function(resolve, reject) {
            Ember.$.ajax({
                url:         _this.tokenEndpoint,
                type:        'POST',
                data:        JSON.stringify({ session : {identification: credentials.identification, password: credentials.password} }),
                contentType: 'application/json'
            }).then(function(response) {
                Ember.run(function() {
                    resolve({
                        token: response.d
                    });
                });
            }, function(xhr, status, error) {
                var response = JSON.parse(xhr.responseText);
                Ember.run(function() {
                    reject(response.error);
                });
            });
        });
    }
    */
});
