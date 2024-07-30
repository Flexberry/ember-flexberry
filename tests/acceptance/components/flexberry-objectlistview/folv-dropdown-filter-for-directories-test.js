import { executeTest } from './execute-folv-test';
import { settled } from '@ember/test-helpers';

executeTest('check dropdown in the filter for directories', async (store, assert, app) => {
  assert.expect(7);

  const path = 'components-examples/flexberry-objectlistview/custom-filter';

  await visit(path);
  assert.equal(currentPath(), path, 'Path is correct');

  const filterButtonDiv = document.querySelector('.buttons.filter-active');
  const filterButton = filterButtonDiv.querySelector('button');

  const olv = document.querySelector('.object-list-view');
  const thead = olv.querySelectorAll('th');
  const index = Array.from(thead).findIndex(item => item.innerText === 'Тип предложения' || item.innerText === 'Type');

  await click(filterButton);

  const objectListViewFiltersColumns = document.querySelectorAll('.object-list-view-filters');
  const objectListViewFiltersRows = objectListViewFiltersColumns[1].children;

  assert.strictEqual(objectListViewFiltersColumns.length === 2, true, 'Filter columns are rendered');
  assert.strictEqual(objectListViewFiltersRows.length > 0, true, 'Filter rows are rendered');

  const dropdownForDirectories = objectListViewFiltersRows[index].querySelector('.flexberry-dropdown');
  const menu = dropdownForDirectories.querySelector('div.menu');
  const items = menu.children;

  assert.strictEqual(dropdownForDirectories !== null, true, 'Dropdown in the filter for directories is rendered');

  await click(dropdownForDirectories);
  assert.strictEqual(dropdownForDirectories.classList.contains('active'), true, 'Dropdown menu is rendered');

  const controller = app.__container__.lookup('controller:' + currentRouteName());
  let filterResult = controller.model.toArray();
  let isFiltered = true;

  filterResult.forEach(element => {
    if (element.type.name !== items[0].innerText) {
      isFiltered = false;
    }
  });

  assert.strictEqual(isFiltered, false, 'Is not filtered');

  await click(items[0]);

  await settled(); // Wait for the click to process

  const refreshButton = document.querySelector('.refresh-button');
  await click(refreshButton);

  await settled(); // Wait for the refresh to process

  filterResult = controller.model.toArray();
  isFiltered = true;

  filterResult.forEach(element => {
    if (element.type.name !== items[0].innerText) {
      isFiltered = false;
    }
  });

  assert.strictEqual(isFiltered, true, 'Is filtered');
});
