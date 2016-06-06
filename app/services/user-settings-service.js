import UserSettingsService from 'ember-flexberry/services/user-settings-service';
import config from '../config/environment';

UserSettingsService.reopen({
  /**
   * Flag: indicates whether to use user settings service (if `true`) or not (if `false`).
   * This flag is readed from config setting `APP.useUserSettingsService` and can be changed programatically later.
   *
   * @property isUserSettingsServiceEnabled
   * @public
   * @type Boolean
   */
  isUserSettingsServiceEnabled: config.APP.useUserSettingsService
});

export default UserSettingsService;
