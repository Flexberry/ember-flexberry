import NewPlatformFlexberryServicesLockAdapter from 'ember-flexberry/adapters/new-platform-flexberry-services-lock';
import config from '../config/environment';

export default NewPlatformFlexberryServicesLockAdapter.extend({
  /**
    @property host
    @type String
  */
  host: config.APP.backendUrls.api,
});
