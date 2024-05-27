import { get } from '@ember/object';
import { typeOf } from '@ember/utils';
import PerfService from 'ember-flexberry/services/perf';
import config from '../config/environment';

let enabled = get(config, 'APP.perf.enabled');
if (typeOf(enabled) === 'boolean') {
  PerfService.reopen({
    enabled: enabled
  });
}

export default PerfService;
