import { executeTest } from './execute-folv-test';
import { settled } from '@ember/test-helpers';

executeTest('check configurate row test', async (store, assert, app) => {
  assert.expect(3);
  const path = 'components-examples/flexberry-objectlistview/configurate-rows';

  await visit(path);
  await settled();
  assert.equal(currentPath(), path, 'Visited the correct path');

  const controller = app.__container__.lookup('controller:' + currentRouteName());
  const $folvContainer = document.querySelectorAll('.object-list-view-container');

  const $positiveRows = $folvContainer[0].querySelector('.positive');

  // Check positive row at folv.
  const $folvRow = $positiveRows;
  let $cell = $folvRow.querySelector('.oveflow-text');
  assert.equal($cell.innerText, controller.configurateRowByAddress || '', 'Positive row text matches');

  // Check positive row at GroupEdit.
  const $geRow = $folvContainer[1].querySelector('.positive');
  $cell = $geRow.querySelector('.oveflow-text');
  assert.equal($cell.innerText, controller.configurateRowByAddress || '', 'Positive row text matches for GroupEdit');
});
