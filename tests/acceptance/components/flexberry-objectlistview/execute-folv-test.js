import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from '../../../helpers/start-app';

export function executeTest(testName, callback) {
  let app;
  let store;

  module('Acceptance | flexberry-objectlistview | ' + testName, {
    beforeEach() {

      // Start application.
      app = startApp();

      // Enable acceptance test mode in application controller (to hide unnecessary markup from application.hbs).
      let applicationController = app.__container__.lookup('controller:application');
      applicationController.set('isInAcceptanceTestMode', true);
      store = app.__container__.lookup('service:store');
    },

    afterEach() {
      Ember.run(app, 'destroy');
    }
  });

  test(testName, (assert) => callback(store, assert, app));
}
