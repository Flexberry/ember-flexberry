import $ from 'jquery';
import { executeTest } from './execute-folv-test';

// Need to add sort by multiple columns.
/* eslint-disable no-unused-vars */
executeTest('check edit button in row', (store, assert, app) => {
  assert.expect(3);
  let path = 'components-acceptance-tests/flexberry-objectlistview/folv-paging';
  visit(path);
  andThen(() => {

    // Check page path.
    assert.equal(currentPath(), path);

    let $editButtonInRow = $('.object-list-view-row-edit-button');

    assert.equal($editButtonInRow.length, 5, 'All row have editButton');

    let $button = $editButtonInRow[0];
    $button.click();

    let done = assert.async();

    window.setTimeout(() => {
      let saveButton = $('.save-button');
      assert.equal(saveButton.length, 1, 'Edit button in row open editform');
      done();
    }, 1500);
  });
});
/* eslint-enable no-unused-vars */
