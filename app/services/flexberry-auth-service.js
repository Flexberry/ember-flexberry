import FlexberryAuthService from 'ember-flexberry/services/flexberry-auth-service';
import config from '../config/environment';

FlexberryAuthService.reopen({
  /**
   * Flag: indicates whether to use flexberry auth service (if `true`) or not (if `false`).
   * This flag is readed from config setting `APP.flexberryAuthService` and can be changed programatically later.
   *
   * @property isFlexberryAuthServiceEnabled
   * @public
   * @type Boolean
   * @default false
   */
  isFlexberryAuthServiceEnabled: config.APP.flexberryAuthService
});

export default FlexberryAuthService;
