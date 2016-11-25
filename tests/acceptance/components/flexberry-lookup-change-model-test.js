import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from '../../helpers/start-app';
import { Query } from 'ember-flexberry-data';

let openLookupDialog = function($lookup) {
  return new Ember.RSVP.Promise((resolve, reject) => {
    let checkIntervalId;
    let checkIntervalSucceed = false;
    let checkInterval = 500;

    let timeout = 10000;

    let $lookupChooseButton = Ember.$('.lookup-choose-button', $lookup);

    // Try to open lookup dialog.
    Ember.run(() => {
      $lookupChooseButton.click();
    });

    // Wait for lookup dialog to be opened & data loaded.
    Ember.run(() => {
      checkIntervalId = window.setInterval(() => {
        let $lookupDialog = Ember.$('.flexberry-modal');
        let $records = Ember.$('.content table.object-list-view tbody tr', $lookupDialog);
        if ($records.length === 0) {
          // Data isn't loaded yet.
          return;
        }

        // Data is loaded.
        // Stop interval & resolve promise.
        window.clearInterval(checkIntervalId);
        checkIntervalSucceed = true;

        resolve($lookupDialog);
      }, checkInterval);
    });

    // Set wait timeout.
    Ember.run(() => {
      window.setTimeout(() => {
        if (checkIntervalSucceed) {
          return;
        }

        // Time is out.
        // Stop intervals & reject promise.
        window.clearInterval(checkIntervalId);
        reject('flexberry-lookup load data operation is timed out');
      }, timeout);
    });
  });
};

let chooseRecordInLookupDialog = function($lookupDialog, recordIndex) {
  return new Ember.RSVP.Promise((resolve, reject) => {
    let checkIntervalId;
    let checkIntervalSucceed = false;
    let checkInterval = 500;

    let timeout = 10000;

    let $records = Ember.$('.content table.object-list-view tbody tr', $lookupDialog);
    let $choosedRecord = Ember.$($records[recordIndex]);

    // Try to choose record in the lookup dialog.
    Ember.run(() => {
      // Inside object-list-views component click actions are available only if cell in row has been clicked.
      // Click on whole row wont take an effect.
      let $choosedRecordFirstCell = Ember.$(Ember.$('td', $choosedRecord)[1]);
      $choosedRecordFirstCell.click();

      // Click on modal-dialog close icon.
      // Сrutch correcting irregular bug
      let $modelDilogClose = Ember.$('.close.icon');
      $modelDilogClose.click();
    });

    // Wait for lookup dialog to be closed.
    Ember.run(() => {
      checkIntervalId = window.setInterval(() => {
        if (!$lookupDialog.hasClass('hidden')) {
          // Dialog is still opened.
          return;
        }

        // Dialog is closed.
        // Stop interval & resolve promise.
        window.clearInterval(checkIntervalId);
        checkIntervalSucceed = true;

        resolve();
      }, checkInterval);
    });

    // Set wait timeout.
    Ember.run(() => {
      window.setTimeout(() => {
        if (checkIntervalSucceed) {
          return;
        }

        // Time is out.
        // Stop intervals & reject promise.
        window.clearInterval(checkIntervalId);
        reject('flexberry-lookup choose record operation is timed out');
      }, timeout);
    });
  });
};

let app;
let latestReceivedRecords;

module('Acceptance | flexberry-lookup-change-model', {
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
        latestReceivedRecords = records.toArray();

        return records;
      });
    };
  },

  afterEach() {
    // Remove semantic ui modal dialog's dimmer.
    Ember.$('body .ui.dimmer.modals').remove();

    // Destroy application.
    Ember.run(app, 'destroy');
  }
});

test('changes in model\'s value causes changes in component\'s specified \'belongsTo\' model', function(assert) {
  visit('components-acceptance-tests/flexberry-lookup/base-operations');
  andThen(function() {

    let $lookup = Ember.$('.flexberry-lookup');
    let $lookupInput = Ember.$('input', $lookup);
    assert.strictEqual($lookupInput.val() === '', true, 'lookup display value is empty by default');

    let controller = app.__container__.lookup('controller:' + currentRouteName());
    let model = Ember.get(controller, 'model');

    let store = app.__container__.lookup('service:store');

    let suggestionType = undefined;

    let query = new Query.Builder(store)
      .from('ember-flexberry-dummy-suggestion-type')
      .selectByProjection('SettingLookupExampleView');


    store.query('ember-flexberry-dummy-suggestion-type', query.build()).then((suggestionTypes) => {

      let suggestionTypesArr = suggestionTypes.toArray();

      suggestionType = suggestionTypesArr.objectAt(0);

    }).then(() => {

      model.set('type', suggestionType);

      assert.strictEqual($lookupInput.val() === '', false, 'lookup display value isn\'t empty');
    });
  });
});
