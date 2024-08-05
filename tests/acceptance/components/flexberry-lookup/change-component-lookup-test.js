import $ from 'jquery';
import RSVP from 'rsvp';
import { run } from '@ember/runloop';
import { get } from '@ember/object';
import { executeTest } from './execute-flexberry-lookup-test';

const openLookupDialog = async ($lookup) => {
  return new RSVP.Promise((resolve, reject) => {
    let checkIntervalId;
    let checkIntervalSucceed = false;
    const checkInterval = 500;
    const timeout = 4000;

    const $lookupChooseButton = $('.ui-change', $lookup);

    // Try to open lookup dialog.
    run(() => {
      $lookupChooseButton.click();
    });

    // Wait for lookup dialog to be opened & data loaded.
    run(() => {
      checkIntervalId = window.setInterval(() => {
        const $lookupDialog = $('.flexberry-modal');
        const $records = $('.content table.object-list-view tbody tr', $lookupDialog);
        if ($records.length === 0) {
          return; // Data isn't loaded yet.
        }

        // Data is loaded.
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
        window.clearInterval(checkIntervalId);
        reject('flexberry-lookup load data operation is timed out');
      }, timeout);
    });
  });
};

const chooseRecordInLookupDialog = async ($lookupDialog, recordIndex) => {
  return new RSVP.Promise((resolve, reject) => {
    let checkIntervalId;
    let checkIntervalSucceed = false;
    const checkInterval = 500;
    const timeout = 4000;

    const $records = $('.content table.object-list-view tbody tr', $lookupDialog);
    const $choosedRecord = $($records[recordIndex]);

    // Try to choose record in the lookup dialog.
    run(() => {
      const $choosedRecordFirstCell = $($('td', $choosedRecord)[1]);
      $choosedRecordFirstCell.click();

      // Click on modal-dialog close icon.
      const $modelDilogClose = $('.close.icon');
      $modelDilogClose.click();
    });

    // Wait for lookup dialog to be closed.
    run(() => {
      checkIntervalId = window.setInterval(() => {
        if (!$lookupDialog.hasClass('hidden')) {
          return; // Dialog is still opened.
        }
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
        window.clearInterval(checkIntervalId);
        reject('flexberry-lookup choose record operation is timed out');
      }, timeout);
    });
  });
};

executeTest('changes in component\'s value causes changes in related model\'s specified \'belongsTo\' relation', async (store, assert, app, latestReceivedRecords) => {
  assert.expect(6);
  await visit('components-acceptance-tests/flexberry-lookup/base-operations');

  const controller = app.__container__.lookup('controller:' + currentRouteName());
  const model = get(controller, 'model');
  const relationName = get(controller, 'relationName');
  const displayAttributeName = get(controller, 'displayAttributeName');
  const updateLookupValueTest = get(controller, 'updateLookupValueTest');
  assert.strictEqual(updateLookupValueTest, 'base', 'updateLookupValueTest has default value');

  const $lookup = $('.flexberry-lookup');
  const $lookupInput = $('input', $lookup);
  assert.strictEqual($lookupInput.val(), '', 'lookup display value is empty by default');

  // Open lookup dialog and choose first record.
  const $lookupDialog = await openLookupDialog($lookup);
  assert.ok($lookupDialog, 'Lookup dialog opened successfully');

  // Choose first loaded record.
  await chooseRecordInLookupDialog($lookupDialog, 0);

  // Check that chosen record is set to related model's 'belongsTo' relation.
  const chosenRecord = model.get(relationName);
  const expectedRecord = latestReceivedRecords[0];
  assert.strictEqual(chosenRecord, expectedRecord, `Chosen record is set to model's '${relationName}' relation as expected`);

  const chosenRecordDisplayAttribute = chosenRecord.get(displayAttributeName);
  assert.strictEqual($lookupInput.val(), chosenRecordDisplayAttribute, `Lookup display value equals to chosen record's '${displayAttributeName}' attribute`);

  const updateLookupValueTestUpdated = get(controller, 'updateLookupValueTest');
  assert.strictEqual(updateLookupValueTestUpdated, 'updated', 'updateLookupValue action was called');
});
