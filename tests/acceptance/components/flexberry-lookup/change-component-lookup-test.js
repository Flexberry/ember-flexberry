import $ from 'jquery';
import RSVP from 'rsvp';
import { run } from '@ember/runloop';
import { get } from '@ember/object';
import { executeTest } from './execute-flexberry-lookup-test';

let openLookupDialog = function($lookup) {
  return new RSVP.Promise((resolve, reject) => {
    let checkIntervalId;
    let checkIntervalSucceed = false;
    let checkInterval = 500;

    let timeout = 4000;

    let $lookupChooseButton = $('.ui-change', $lookup);

    // Try to open lookup dialog.
    run(() => {
      $lookupChooseButton.click();
    });

    // Wait for lookup dialog to be opened & data loaded.
    run(() => {
      checkIntervalId = window.setInterval(() => {
        let $lookupDialog = $('.flexberry-modal');
        let $records = $('.content table.object-list-view tbody tr', $lookupDialog);
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
    run(() => {
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
  return new RSVP.Promise((resolve, reject) => {
    let checkIntervalId;
    let checkIntervalSucceed = false;
    let checkInterval = 500;

    let timeout = 4000;

    let $records = $('.content table.object-list-view tbody tr', $lookupDialog);
    let $choosedRecord = $($records[recordIndex]);

    // Try to choose record in the lookup dialog.
    run(() => {
      // Inside object-list-views component click actions are available only if cell in row has been clicked.
      // Click on whole row wont take an effect.
      let $choosedRecordFirstCell = $($('td', $choosedRecord)[1]);
      $choosedRecordFirstCell.click();

      // Click on modal-dialog close icon.
      // Сrutch correcting irregular bug
      let $modelDilogClose = $('.close.icon');
      $modelDilogClose.click();
    });

    // Wait for lookup dialog to be closed.
    run(() => {
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
    run(() => {
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

executeTest('changes in component\'s value causes changes in related model\'s specified \'belongsTo\' relation',
(store, assert, app, latestReceivedRecords) => {
  assert.expect(4);
  visit('components-acceptance-tests/flexberry-lookup/base-operations');

  andThen(function() {
    let controller = app.__container__.lookup('controller:' + currentRouteName());
    let model = get(controller, 'model');
    let relationName = get(controller, 'relationName');
    let displayAttributeName = get(controller, 'displayAttributeName');

    let $lookup = $('.flexberry-lookup');
    let $lookupInput = $('input', $lookup);
    assert.strictEqual($lookupInput.val(), '', 'lookup display value is empty by default');

    // Wait for lookup dialog to be opened, choose first record & check component's state.
    let asyncOperationsCompleted = assert.async();
    openLookupDialog($lookup).then(($lookupDialog) => {
      assert.ok($lookupDialog);

      // Lookup dialog successfully opened & data is loaded.
      // Try to choose first loaded record.
      return chooseRecordInLookupDialog($lookupDialog, 0);
    }).then(() => {
      // First loaded record chosen successfully.
      // Check that chosen record is now set to related model's 'belongsTo' relation.
      let chosenRecord = model.get(relationName);
      let expectedRecord = latestReceivedRecords[0];
      assert.strictEqual(
        chosenRecord,
        expectedRecord,
        'chosen record is set to model\'s \'' + relationName + '\' relation as expected');

      let chosenRecordDisplayAttribute = chosenRecord.get(displayAttributeName);
      assert.strictEqual(
        $lookupInput.val(),
        chosenRecordDisplayAttribute,
        'lookup display value is equals to chosen record\'s \'' + displayAttributeName + '\' attribute');
    }).catch((reason) => {
      throw new Error(reason);
    }).finally(() => {
      asyncOperationsCompleted();
    });
  });
});
