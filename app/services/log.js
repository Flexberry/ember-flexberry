import Ember from 'ember';
import LogService from 'ember-flexberry/services/log';
import config from '../config/environment';

let enabled = Ember.get(config, 'APP.log.enabled');
if (Ember.typeOf(enabled) === 'boolean') {
  LogService.reopen({
    enabled: enabled
  });
}

let storeErrorMessages = Ember.get(config, 'APP.log.storeErrorMessages');
if (Ember.typeOf(storeErrorMessages) === 'boolean') {
  LogService.reopen({
    storeErrorMessages: storeErrorMessages
  });
}

let storeWarnMessages = Ember.get(config, 'APP.log.storeWarnMessages');
if (Ember.typeOf(storeWarnMessages) === 'boolean') {
  LogService.reopen({
    storeWarnMessages: storeWarnMessages
  });
}

let storeLogMessages = Ember.get(config, 'APP.log.storeLogMessages');
if (Ember.typeOf(storeLogMessages) === 'boolean') {
  LogService.reopen({
    storeLogMessages: storeLogMessages
  });
}

let storeInfoMessages = Ember.get(config, 'APP.log.storeInfoMessages');
if (Ember.typeOf(storeInfoMessages) === 'boolean') {
  LogService.reopen({
    storeInfoMessages: storeInfoMessages
  });
}

let storeDebugMessages = Ember.get(config, 'APP.log.storeDebugMessages');
if (Ember.typeOf(storeDebugMessages) === 'boolean') {
  LogService.reopen({
    storeDebugMessages: storeDebugMessages
  });
}

let storeDeprecationMessages = Ember.get(config, 'APP.log.storeDeprecationMessages');
if (Ember.typeOf(storeDeprecationMessages) === 'boolean') {
  LogService.reopen({
    storeDeprecationMessages: storeDeprecationMessages
  });
}

export default LogService;
