/* eslint-disable ember/use-ember-get-and-set */
/* eslint-disable ember/no-test-import-export */
/* global visit, andThen, currentURL */
/* eslint-disable ember/no-test-and-then */
import $ from 'jquery';
import { run } from '@ember/runloop';

import { executeTest } from './execute-flexberry-lookup-test';

executeTest('flexberry-lookup prefer developer to default user setting test', (store, assert) => {
  assert.expect(2);

  visit('components-examples/flexberry-lookup/user-settings-example');

  andThen(function () {
    assert.equal(currentURL(), 'components-examples/flexberry-lookup/user-settings-example');

    let $lookupButtouChoose = $('.ui-change');

    // Click choose button.
    run(() => {
      $lookupButtouChoose.click();
    });

    run(() => {
      var done = assert.async();
      setTimeout(function () {

        let $lookupSearch = $('.content table.object-list-view');
        let $lookupSearchThead = $lookupSearch.children('thead');
        let $lookupSearchTr = $lookupSearchThead.children('tr');
        let $lookupHeaders = $lookupSearchTr.children('th');

        // Check count at table header.
        assert.strictEqual($lookupHeaders.length === 1, true, 'Component render olv with developer user setting');

        done();
      }, 1000);
    });
  });
});
