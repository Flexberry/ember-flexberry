import Ember from 'ember';
import UserSettingsService from 'ember-flexberry/services/user-settings';
import config from '../config/environment';

let enabled = Ember.get(config, 'APP.useUserSettingsService');
let appName = Ember.get(config, 'APP.name');
if (Ember.typeOf(enabled) === 'boolean') {
  UserSettingsService.reopen({
    isUserSettingsServiceEnabled: enabled,
    appName: appName
  });
}

export default UserSettingsService;
