/* eslint-disable ember/no-test-import-export */
/* global visit, currentURL */
import $ from 'jquery';
import { executeTest } from './execute-flexberry-lookup-test';
import EmberObject from '@ember/object';

executeTest('flexberry-lookup render olv with default user setting test', async (store, assert, app) => {
  assert.expect(2);

  await visit('components-examples/flexberry-lookup/user-settings-example');

  assert.equal(currentURL(), 'components-examples/flexberry-lookup/user-settings-example');

  const $lookupChooseButton = $('.ui-change');

  // Click choose button.
  await click($lookupChooseButton);

  let $lookupSearch = $('.content table.object-list-view');
  let $lookupSearchThead = $lookupSearch.children('thead');
  let $lookupSearchTr = $lookupSearchThead.children('tr');
  let $lookupHeaders = $lookupSearchTr.children('th');

  // Check count at table header.
  assert.strictEqual($lookupHeaders.length, 2, 'Component render olv with default user setting');
}, (app) => {
  const service = app.__container__.lookup('service:user-settings');
  service.getCurrentUserSetting = () => EmberObject.create({});
});
