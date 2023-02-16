import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from '../../../helpers/start-app';

export function executeTest(testName, callback, additionalBeforeEachSettings) {
  let app;
  let store;
  let latestReceivedRecords = Ember.A();

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

      if (!Ember.isNone(additionalBeforeEachSettings) && typeof additionalBeforeEachSettings === 'function') {
        additionalBeforeEachSettings(app, store);
      }
    },

    afterEach() {
      // Remove semantic ui modal dialog's dimmer.
      Ember.$('body .ui.dimmer.modals').remove();

      // Destroy application.
      Ember.run(app, 'destroy');
    },
  });

  test(testName, (assert) => callback(store, assert, app, latestReceivedRecords));
}
