import { run } from '@ember/runloop';
import { A, isArray } from '@ember/array';
import { module, skip } from 'qunit';
import startApp from '../../../helpers/start-app';

let dataForDestroy = A();
let app;

export function executeTest(testName, callback) {
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
      run(() => {
        if (dataForDestroy.length !== 0) {
          recursionDelete(0);
        } else {
          run(app, 'destroy');
        }
      });
    }
  });

  skip(testName, (assert) => callback(store, assert, app));
}

/**
  Function to delete data after testing.

  @public
  @method addDataForDestroy
  @param {Object} data  or array of Object.
 */

export function addDataForDestroy(data) {
  if (isArray(data)) {
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
    run(app, 'destroy');
  }
}
