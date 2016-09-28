import Ember from 'ember';
import PerfService from 'ember-flexberry/services/perf';
import config from '../config/environment';

let enabled = Ember.get(config, 'APP.perf.enabled');
if (Ember.typeOf(enabled) === 'boolean') {
  PerfService.reopen({
    enabled: enabled
  });
}

export default PerfService;
