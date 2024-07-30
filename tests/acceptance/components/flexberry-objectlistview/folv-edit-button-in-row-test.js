import { executeTest } from './execute-folv-test';
import { openEditFormByFunction } from 'dummy/tests/acceptance/components/flexberry-objectlistview/folv-tests-functions';

executeTest('check edit button in row', async (store, assert, app) => {
  assert.expect(3);
  const path = 'components-acceptance-tests/flexberry-objectlistview/folv-paging';
  
  await visit(path);
  
  // Check page path.
  assert.equal(currentPath(), path, 'Path is correct');

  const editButtonsInRow = document.querySelectorAll('.object-list-view-row-edit-button');
  assert.equal(editButtonsInRow.length, 5, 'All rows have edit buttons');

  // Apply filter function.
  const openEditFormFunction = () => {
    const editButtonInRow = editButtonsInRow[0];
    return click(editButtonInRow);
  };

  // Open edit form.
  await openEditFormByFunction(openEditFormFunction);
  assert.ok(true, 'Edit form opened');
});
