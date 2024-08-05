import { executeTest } from './execute-folv-test';
import { settled } from '@ember/test-helpers';

executeTest('test checking', async (store, assert) => {
  assert.expect(2);
  const path = 'components-acceptance-tests/flexberry-objectlistview/folv-paging';

  await visit(path);
  assert.equal(currentPath(), path, 'Visited the correct path');

  const $folvContainer = document.querySelector('.object-list-view-container');
  const $row = $folvContainer.querySelector('table.object-list-view tbody tr');

  // Mark first record.
  const $firstCell = $row.querySelector('.object-list-view-helper-column-cell');
  const $checkboxInRow = $firstCell.querySelector('.flexberry-checkbox');

  await click($checkboxInRow);
  await settled(); // Ждем завершения всех асинхронных действий

  const recordIsChecked = $checkboxInRow.classList.contains('checked');
  assert.ok(recordIsChecked, 'First row is checked');
});
