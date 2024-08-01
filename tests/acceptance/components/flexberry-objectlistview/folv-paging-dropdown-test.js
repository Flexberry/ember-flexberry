import { later, run } from '@ember/runloop';
import { executeTest} from './execute-folv-test';
import { addRecords, deleteRecords, refreshListByFunction } from './folv-tests-functions';

import generateUniqueId from 'ember-flexberry-data/utils/generate-unique-id';

import $ from 'jquery';

executeTest('check paging dropdown', async (store, assert, app) => {
  assert.expect(5);
  const path = 'components-acceptance-tests/flexberry-objectlistview/folv-paging';
  const modelName = 'ember-flexberry-dummy-suggestion-type';
  const uuid = generateUniqueId();

  // Add records for paging.
  try {
    let resolvedPromises = await addRecords(store, modelName, uuid);
    assert.ok(resolvedPromises, 'All records saved.');

    await visit(path);
    
    assert.equal(currentPath(), path);

    let trTableBody;
    let activeItem;

    // Refresh function.
    const refreshFunction = async function() {
      let $folvPerPageButton = $('.flexberry-dropdown.compact');
      let $menu = $('.menu', $folvPerPageButton);
      trTableBody = () => { return $($('table.object-list-view tbody tr')).length.toString(); };

      activeItem =  () => { return $($('.item.active.selected', $menu)).text(); };

      // The list should be more than 5 items.
      assert.equal(activeItem(), trTableBody(), 'equal perPage and visible element count');
      await click( $folvPerPageButton);
      let timeout = 500;
      return new Promise((resolve) => {
        later(async() => {
          let menuIsVisible = $menu.hasClass('visible');
          assert.strictEqual(menuIsVisible, true, 'menu is visible');
          let $choosedItem = $('.item', $menu);
          await click($choosedItem[1]);
          resolve();
        }, timeout);
      });
    };

    let controller = app.__container__.lookup('controller:' + currentRouteName());

    await refreshListByFunction(refreshFunction, controller);

      // The list should be more than 10 items
      assert.equal(activeItem(), trTableBody(), 'equal perPage and visible element count');
    } catch (reason) {
      // Error output.
      assert.ok(false, reason);
    } finally {
      await deleteRecords(store, modelName, uuid, assert);
    }
  });
