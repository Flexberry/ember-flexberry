/* eslint-disable ember/use-ember-get-and-set */
/* eslint-disable ember/no-test-import-export */
import $ from 'jquery';
import { settled } from '@ember/test-helpers';
import { run } from '@ember/runloop';
import { executeTest } from './execute-flexberry-lookup-test';

executeTest('flexberry-lookup prefer developer to default user setting test', async (store, assert) => {
  assert.expect(2);

  await visit('components-examples/flexberry-lookup/user-settings-example');
  assert.equal(currentURL(), 'components-examples/flexberry-lookup/user-settings-example');

  let $lookupButtonChoose = $('.ui-change');

  // Click choose button.
  run(() => {
    click($lookupButtonChoose);
  });

  // Wait for the table to be updated.
  await settled();

  let $lookupSearch = $('.content table.object-list-view');
  let $lookupSearchThead = $lookupSearch.children('thead');
  let $lookupSearchTr = $lookupSearchThead.children('tr');
  let $lookupHeaders = $lookupSearchTr.children('th');

  // Check count at table header.
  assert.strictEqual($lookupHeaders.length === 1, true, 'Component renders OLV with developer user setting');
});
