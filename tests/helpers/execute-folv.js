/* eslint-disable ember/use-ember-get-and-set */
import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from './start-app';

let dataForDestroy = Ember.A();
let app;

export function executeTest(testName, callback) {
  let store;
  let userSettingsService;

  /* eslint-disable-next-line qunit/no-global-module-test */
  module('Acceptance | flexberry-objectlistview | ' + testName, {
    beforeEach() {
      Ember.run(() => {
        // Start application.
        app = startApp();

        // Just take it and turn it off...
        Ember.set(app.__container__.lookup('service:log'), 'enabled', false);

        // Enable acceptance test mode in application controller (to hide unnecessary markup from application.hbs).
        let applicationController = app.__container__.lookup('controller:application');
        Ember.set(applicationController, 'isInAcceptanceTestMode', true);
        store = app.__container__.lookup('service:store');

        userSettingsService = app.__container__.lookup('service:user-settings');
        let getCurrentPerPage = function() {
          return 5;
        };

        Ember.set(userSettingsService, 'getCurrentPerPage', getCurrentPerPage);
      });
    },

    afterEach() {
      Ember.run(() => {
        if (dataForDestroy.length !== 0) {
          recursionDelete(0);
        } else {
          Ember.run(app, 'destroy');
        }
      });
    }
  });

  /* eslint-disable-next-line qunit/no-global-module-test */
  test(testName, (assert) => callback(store, assert, app));
}

/**
  Function to delete data after testing.

  @public
  @method addDataForDestroy
  @param {Object} data  or array of Object.
 */

export function addDataForDestroy(data) {
  if (Ember.isArray(data)) {
    dataForDestroy.addObjects(data);
  } else {
    dataForDestroy.addObject(data);
  }
}

function recursionDelete(index) {
  if (index < dataForDestroy.length) {
    if (!dataForDestroy[index].currentState.isDeleted) {
      dataForDestroy[index].destroyRecord().then(() => {
        recursionDelete(index + 1);
      });
    } else {
      recursionDelete(index + 1);
    }
  } else {
    dataForDestroy.clear();
    Ember.run(app, 'destroy');
  }
}
