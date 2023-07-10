import { executeTest} from './execute-folv-test';
import $ from 'jquery';

executeTest('check configurate row test', (store, assert, app) => {
  assert.expect(5);
  let path = 'components-examples/flexberry-objectlistview/configurate-rows';

  visit(path);
  andThen(() => {
    assert.equal(currentPath(), path);

    let controller = app.__container__.lookup('controller:' + currentRouteName());
    let $folvContainer = $('.object-list-view-container');

    // Get all positive row.
    let $positivRow = $('.positive', $folvContainer);
    assert.equal($positivRow.length, 2, 'One positive row at component');

    // Check positive row at folv.
    let $folvRow = $positivRow[0];
    let $cell = $('.oveflow-text', $folvRow);
    assert.equal($cell[0].innerText, controller.configurateRowByAddress, '');

    // Check positive row at GroupEdit.
    let $geRow = $positivRow[1];
    $cell = $('.oveflow-text', $geRow);
    assert.equal($cell[0].innerText, controller.configurateRowByAddress, '');

    // Get all negative row.
    let $negativRow = $('.negative', $folvContainer);
    assert.equal($negativRow.length, 8, 'Four negative row at component');
  });
});
