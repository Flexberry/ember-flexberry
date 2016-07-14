import Ember from 'ember';
import LogService from 'ember-flexberry/services/log';
import config from '../config/environment';

let enabled = Ember.get(config, 'APP.log.enabled');
if (Ember.typeOf(enabled) === 'boolean') {
  LogService.reopen({
    enabled: enabled
  });
}

export default LogService;
