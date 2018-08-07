import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from '../../../helpers/start-app';

let dataForDestroy = Ember.A();
let app;

export function executeTest(testName, callback) {
  let store;
  let userSettingsService;

  module('Acceptance | flexberry-objectlistview | ' + testName, {
    beforeEach() {

      // Start application.
      app = startApp();

      // Enable acceptance test mode in application controller (to hide unnecessary markup from application.hbs).
      let applicationController = app.__container__.lookup('controller:application');
      applicationController.set('isInAcceptanceTestMode', true);
      store = app.__container__.lookup('service:store');

      userSettingsService = app.__container__.lookup('service:user-settings');
      let getCurrentPerPage = function() {
        return 5;
      };

      userSettingsService.set('getCurrentPerPage', getCurrentPerPage);
    },

    afterEach(assert) {
      Ember.run(() => {
        if(dataForDestroy.length !== 0) {
          recursionDelete(0);
        } else {
          Ember.run(app, 'destroy');
        }
      });
    }
  });

  test(testName, (assert) => callback(store, assert, app));
}

/**
  Function to delete data after testing.

  @public
  @method addDataForDestroy
  @param {Object} data  or array of Object.
 */

export function addDataForDestroy(data) {
 if (Array.isArray(data)) {
   data.forEach((item) => {
     dataForDestroy.pushObject(item);
   });
 } else {
   dataForDestroy.pushObject(data);
 }
}

function recursionDelete(index) {
  if(index >= dataForDestroy.length - 1) {
    if(!dataForDestroy[index].currentState.isDeleted) {
      dataForDestroy[index].destroyRecord().then(() => {
        dataForDestroy.clear();
        Ember.run(app, 'destroy');
      });
    } else {
      dataForDestroy.clear();
      Ember.run(app, 'destroy');
    }
  } else {
    if(!dataForDestroy[index].currentState.isDeleted) {
      dataForDestroy[index].destroyRecord().then(() => {
        recursionDelete(index + 1);
      });
    } else {
      recursionDelete(index + 1);
    }
  }
}
