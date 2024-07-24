/* eslint-disable ember/no-test-import-export */
/* global visit, currentURL */
import Ember from 'ember';
import sinon from 'sinon';
import { executeTest } from './execute-flexberry-lookup-test';
import { loadingList } from './lookup-test-functions';

executeTest('flexberry-lookup events test', async (store, assert, app) => {
  await visit('components-acceptance-tests/flexberry-lookup/settings-example-events');

  assert.equal(currentURL(), 'components-acceptance-tests/flexberry-lookup/settings-example-events');
  let lookupEventsService = app.__container__.lookup('service:lookup-events');
  assert.notEqual(lookupEventsService, null);

  // Spy on event triggering.
  let spy = sinon.spy(lookupEventsService, "lookupDialogOnDataLoadedTrigger");
  let $lookupChooseButton = Ember.$('.ui-change');
  assert.ok(spy.notCalled);

  const compareLookupModalWindowData = (spyCallCountExpected, isInitialCallExpected) => {
    assert.equal(spy.callCount, spyCallCountExpected);
    if (spy.callCount !== spyCallCountExpected) {
      return;
    }

    let callArgs = spy.args[spy.callCount - 1];
    assert.equal(callArgs.length, 3);
    let dataLoaded = callArgs[1];
    let isInitialCall = callArgs[2];
    assert.equal(isInitialCall, isInitialCallExpected);

    let $lookupDialog = Ember.$('.flexberry-modal');
    let $records = Ember.$('.content table.object-list-view tbody tr', $lookupDialog);
    let lookupRecordCount = $records.length;
    assert.equal(dataLoaded.content.length, lookupRecordCount);

    // Comparison data from spy and olv table.
    for (let i = 0; i < lookupRecordCount; i++) {
      let suggestionTypeName = Ember.get(dataLoaded.content[i]._record, 'name');
      let $cellText = Ember.$($records[i]).children('td').eq(1).text().trim();
      assert.strictEqual($cellText, suggestionTypeName);
    }
  };

  // Wait for lookup dialog to be opened.
  await loadingList($lookupChooseButton, '.flexberry-modal', '.content table.object-list-view tbody tr');
  compareLookupModalWindowData(1, true);

  // Call reload on modal window without closing it.
  let $lookupDialog = Ember.$('.flexberry-modal');
  let $header = Ember.$('.content table.object-list-view thead tr th', $lookupDialog).eq(1);
  assert.equal(spy.callCount, 1);

  // Lookup dialog successfully opened & data is loaded.
  // Try to change sorting.
  await loadingList($header, '.flexberry-modal', '.content table.object-list-view tbody tr');
  compareLookupModalWindowData(2, false);
});
