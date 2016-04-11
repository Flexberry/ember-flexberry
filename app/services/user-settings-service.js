import UserSettingsService from 'ember-flexberry/services/user-settings-service';
import config from '../config/environment';

UserSettingsService.reopen({
  /**
   * Flag: indicates wether to use user settings service (if `true`) or not (if `false`).
   * It reads value from config.
   *
   * @property isUserSettingsServiceEnabled
   * @public
   * @type Boolean
   */
  isUserSettingsServiceEnabled: config.APP.useUserSettingsService
});

export default UserSettingsService;
