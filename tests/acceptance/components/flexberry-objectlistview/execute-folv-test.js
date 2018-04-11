import { run } from '@ember/runloop';
import { module, test } from 'qunit';
import startApp from '../../../helpers/start-app';

export function executeTest(testName, callback) {
  let app;
  let store;
  let userSettingsService;

  module('Acceptance | flexberry-objectlistview | ' + testName, {
    beforeEach() {
      run(() => {
        // Start application.
        app = startApp();

        // Just take it and turn it off...
        app.__container__.lookup('service:log').set('enabled', false);

        // Enable acceptance test mode in application controller (to hide unnecessary markup from application.hbs).
        let applicationController = app.__container__.lookup('controller:application');
        applicationController.set('isInAcceptanceTestMode', true);
        store = app.__container__.lookup('service:store');

        userSettingsService = app.__container__.lookup('service:user-settings');
        let getCurrentPerPage = function() {
          return 5;
        };

        userSettingsService.set('getCurrentPerPage', getCurrentPerPage);
      });
    },

    afterEach() {
      run(app, 'destroy');
    },
  });

  test(testName, (assert) => callback(store, assert, app));
}
