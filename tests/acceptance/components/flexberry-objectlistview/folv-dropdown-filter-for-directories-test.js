import $ from 'jquery';
import { executeTest } from './execute-folv-test';
import { run } from '@ember/runloop';
import wait from 'ember-test-helpers/wait';

executeTest('check dropdown in the filter for directories', (store, assert, app) => {
  assert.expect(7);

  const path = 'components-examples/flexberry-objectlistview/custom-filter';

  visit(path);

  andThen(() => {
    assert.equal(currentPath(), path, 'Path is correct');

    let $filterButtonDiv = $('.buttons.filter-active');
    let $filterButton = $filterButtonDiv.children('button');

    let $olv = $('.object-list-view');
    let $thead = $('th', $olv);
    const index = Object.values($thead).findIndex(item => item.innerText === 'Тип предложения' || item.innerText === 'Type');

    andThen(() => {
      run(() => $filterButton.click());

      let $objectListViewFiltersColumns = $('.object-list-view-filters');
      let $objectListViewFiltersRows = $($objectListViewFiltersColumns[1]).children();

      assert.strictEqual($objectListViewFiltersColumns.length === 2, true, 'Filter columns are rendered');
      assert.strictEqual($objectListViewFiltersRows.length === 11, true, 'Filter rows are rendered');

      let $dropdownForDirectories = $($objectListViewFiltersRows[index]).find('.flexberry-dropdown');
      let $menu = $dropdownForDirectories.children('div.menu');
      let $items = $menu.children();

      assert.strictEqual($dropdownForDirectories.length === 1, true, 'Dropdown in the filter for directories is rendered');

      run(() => $dropdownForDirectories.click());

      assert.strictEqual($dropdownForDirectories.hasClass('active'), true, 'Dropdown menu is rendered');

      const controller = app.__container__.lookup('controller:' + currentRouteName());
      let filtherResult = controller.model.toArray();
      let isFiltered = true;
  
      filtherResult.forEach(element => {
        if (element.type.name !== $items[0].innerText) {
          isFiltered = false;
        }
      });
  
      assert.strictEqual(isFiltered, false, 'Is not filtered');

      run(() => $($items[0]).click());

      wait().then(() => {
        let $refreshButton = $('.refresh-button')[0];
        run(() => $refreshButton.click());

        wait().then(() => {
          filtherResult = controller.model.toArray();
          isFiltered = true;

          filtherResult.forEach(element => {
            if (element.type.name !== $items[0].innerText) {
              isFiltered = false;
            }
          });

          assert.strictEqual(isFiltered, true, 'Is filtered');
        });
      });
    });
  });
});