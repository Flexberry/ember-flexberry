import Ember from 'ember';
import AdvLimitService from 'ember-flexberry/services/adv-limit';
import config from '../config/environment';

/*let enabled = Ember.get(config, 'APP.useAdvLimitService');
let appName = Ember.get(config, 'APP.name');
if (Ember.typeOf(enabled) === 'boolean') {
  advlimit.reopen({
    isUserSettingsServiceEnabled: enabled,
    appName: appName
  });
}*/

export default AdvLimitService;
