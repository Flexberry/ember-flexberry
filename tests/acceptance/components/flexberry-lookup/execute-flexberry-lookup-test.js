import $ from 'jquery';
import { run } from '@ember/runloop';
import { module, test } from 'qunit';
import { A } from '@ember/array';
import startApp from '../../../helpers/start-app';

export function executeTest(testName, callback) {
  let app;
  let store;
  let latestReceivedRecords = A();

  module('Acceptance | flexberry-lookup-base |' + testName, {
    beforeEach() {

      // Start application.
      app = startApp();

      // Enable acceptance test mode in application controller (to hide unnecessary markup from application.hbs).
      let applicationController = app.__container__.lookup('controller:application');
      applicationController.set('isInAcceptanceTestMode', true);

      // Override store.query method to receive & remember records which will be requested by lookup dialog.
      let store = app.__container__.lookup('service:store');
      let originalQueryMethod = store.query;
      store.query = function(...args) {
        // Call original method & remember returned records.
        return originalQueryMethod.apply(this, args).then((records) => {
          latestReceivedRecords.clear();
          latestReceivedRecords.addObjects(records.toArray());

          return records;
        });
      };
    },

    afterEach() {
      // Remove semantic ui modal dialog's dimmer.
      $('body .ui.dimmer.modals').remove();

      // Destroy application.
      run(app, 'destroy');
    },
  });

  test(testName, (assert) => callback(store, assert, app, latestReceivedRecords));
}
