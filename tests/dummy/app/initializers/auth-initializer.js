import Ember from 'ember';
import FlexberryAuthService from 'ember-flexberry/services/flexberry-auth-service';

export function initialize(application) {
  FlexberryAuthService.reopen({
    currentAuthService: Ember.inject.service('flexberry-ember-simple-auth-service')
  });
}

export default {
  name: 'auth-initializer',
  initialize
};
