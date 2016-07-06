import Ember from 'ember';
import UserSettingsService from 'ember-flexberry/services/user-settings';
import config from '../config/environment';

let enabled = Ember.get(config, 'APP.useUserSettingsService');
if (Ember.typeOf(enabled) === 'boolean') {
  UserSettingsService.reopen({
    isUserSettingsServiceEnabled: enabled
  });
}

export default UserSettingsService;
