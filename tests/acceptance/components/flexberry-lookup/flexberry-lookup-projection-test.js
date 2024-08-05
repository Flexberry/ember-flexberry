import $ from 'jquery';
import { settled } from '@ember/test-helpers';
import { executeTest } from './execute-flexberry-lookup-test';

executeTest('flexberry-lookup projection test', async (store, assert, app) => {
  assert.expect(2);

  await visit('components-acceptance-tests/flexberry-lookup/settings-example-projection');
  
  assert.equal(currentURL(), 'components-acceptance-tests/flexberry-lookup/settings-example-projection');

  let $lookupButtonChoose = $('.ui-change');

  // Click choose button.
  await click($lookupButtonChoose);

  // Wait for the table to be updated.
  await settled();

  let $lookupSearch = $('.content table.object-list-view');
  let $lookupSearchThead = $lookupSearch.children('thead');
  let $lookupSearchTr = $lookupSearchThead.children('tr');
  let $lookupHeaders = $lookupSearchTr.children('th');

  // Check count at table header.
  assert.strictEqual($lookupHeaders.length, 3, 'Component has SuggestionTypeE projection');
});
