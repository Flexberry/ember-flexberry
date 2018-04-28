import { get } from '@ember/object';
import { typeOf } from '@ember/utils';
import LogService from 'ember-flexberry/services/log';
import config from '../config/environment';

let enabled = get(config, 'APP.log.enabled');
if (typeOf(enabled) === 'boolean') {
  LogService.reopen({
    enabled: enabled
  });
}

let storeErrorMessages = get(config, 'APP.log.storeErrorMessages');
if (typeOf(storeErrorMessages) === 'boolean') {
  LogService.reopen({
    storeErrorMessages: storeErrorMessages
  });
}

let storeWarnMessages = get(config, 'APP.log.storeWarnMessages');
if (typeOf(storeWarnMessages) === 'boolean') {
  LogService.reopen({
    storeWarnMessages: storeWarnMessages
  });
}

let storeLogMessages = get(config, 'APP.log.storeLogMessages');
if (typeOf(storeLogMessages) === 'boolean') {
  LogService.reopen({
    storeLogMessages: storeLogMessages
  });
}

let storeInfoMessages = get(config, 'APP.log.storeInfoMessages');
if (typeOf(storeInfoMessages) === 'boolean') {
  LogService.reopen({
    storeInfoMessages: storeInfoMessages
  });
}

let storeDebugMessages = get(config, 'APP.log.storeDebugMessages');
if (typeOf(storeDebugMessages) === 'boolean') {
  LogService.reopen({
    storeDebugMessages: storeDebugMessages
  });
}

let storeDeprecationMessages = get(config, 'APP.log.storeDeprecationMessages');
if (typeOf(storeDeprecationMessages) === 'boolean') {
  LogService.reopen({
    storeDeprecationMessages: storeDeprecationMessages
  });
}

let storePromiseErrors = get(config, 'APP.log.storePromiseErrors');
if (typeOf(storePromiseErrors) === 'boolean') {
  LogService.reopen({
    storePromiseErrors: storePromiseErrors
  });
}

let showPromiseErrors = get(config, 'APP.log.showPromiseErrors');
if (typeOf(showPromiseErrors) === 'boolean') {
  LogService.reopen({
    showPromiseErrors: showPromiseErrors
  });
}

export default LogService;
