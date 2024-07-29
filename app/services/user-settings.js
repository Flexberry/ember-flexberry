import { get } from '@ember/object';
import { typeOf } from '@ember/utils';
import UserSettingsService from 'ember-flexberry/services/user-settings';
import config from '../config/environment';

let enabled = get(config, 'APP.useUserSettingsService');
let appName = get(config, 'APP.name');
if (typeOf(enabled) === 'boolean') {
  UserSettingsService.reopen({
    isUserSettingsServiceEnabled: enabled,
    appName: appName
  });
}

export default UserSettingsService;
