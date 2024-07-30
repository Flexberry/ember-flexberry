import { run } from '@ember/runloop';
import { A, isArray } from '@ember/array';
import { module, test } from 'qunit';
import startApp from '../../../helpers/start-app';

let dataForDestroy = A();
let app;

export function executeTest(testName, callback) {
  let store;
  let userSettingsService;

  module('Acceptance | flexberry-objectlistview | ' + testName, function(hooks) {
    hooks.beforeEach(function(assert) {
      run(() => {
        // Start application.
        app = startApp();

        // Disable logging service.
        let logService = app.__container__.lookup('service:log');
        logService.set('enabled', false);

        // Enable acceptance test mode in application controller.
        let applicationController = app.__container__.lookup('controller:application');
        applicationController.set('isInAcceptanceTestMode', true);

        store = app.__container__.lookup('service:store');

        userSettingsService = app.__container__.lookup('service:user-settings');
        userSettingsService.set('getCurrentPerPage', () => 5);
      });
    });

    hooks.afterEach(function(assert) {
      run(() => {
        if (dataForDestroy.length !== 0) {
          recursionDelete(0);
        } else {
          run(app, 'destroy');
        }
      });
    });

    test(testName, function(assert) {
      return callback(store, assert, app);
    });
  });
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

function recursionDelete(index, resolve) {
  if (index < dataForDestroy.length) {
    if (!dataForDestroy[index].currentState.isDeleted) {
      dataForDestroy[index].destroyRecord().then(() => {
        recursionDelete(index + 1, resolve);
      });
    } else {
      recursionDelete(index + 1, resolve);
    }
  } else {
    dataForDestroy.clear();
    run(app, 'destroy');
    resolve();
  }
}