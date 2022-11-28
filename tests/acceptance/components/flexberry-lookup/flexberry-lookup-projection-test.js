import $ from 'jquery';
import { run } from '@ember/runloop';
import { executeTest } from './execute-flexberry-lookup-test';

/* eslint-disable no-unused-vars */
executeTest('flexberry-lookup projection test', (store, assert, app) => {
/* eslint-enable no-unused-vars */

  assert.expect(2);

  visit('components-acceptance-tests/flexberry-lookup/settings-example-projection');

  andThen(function() {
    assert.equal(currentURL(), 'components-acceptance-tests/flexberry-lookup/settings-example-projection');

    let $lookupButtouChoose = $('.ui-change');

    // Click choose button.
    run(() => {
      $lookupButtouChoose.click();
    });

    run(() => {
      let done = assert.async();
      setTimeout(function() {

        let $lookupSearch = $('.content table.object-list-view');
        let $lookupSearchThead = $lookupSearch.children('thead');
        let $lookupSearchTr = $lookupSearchThead.children('tr');
        let $lookupHeaders = $lookupSearchTr.children('th');

        // Check count at table header.
        assert.strictEqual($lookupHeaders.length === 3, true, 'Component has SuggestionTypeE projection');

        done();
      }, 5000);
    });
  });
});
