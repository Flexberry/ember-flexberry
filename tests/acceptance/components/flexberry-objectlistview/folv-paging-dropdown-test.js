/* global $ */
import { later, run } from '@ember/runloop';
import { executeTest} from './execute-folv-test';
import { addRecords, deleteRecords, refreshListByFunction } from './folv-tests-functions';

import generateUniqueId from 'ember-flexberry-data/utils/generate-unique-id';

executeTest('check paging dropdown', (store, assert, app) => {
  assert.expect(5);
  let path = 'components-acceptance-tests/flexberry-objectlistview/folv-paging';
  let modelName = 'ember-flexberry-dummy-suggestion-type';
  let uuid = generateUniqueId();

  // Add records for paging.
  run(() => {

    addRecords(store, modelName, uuid).then(function(resolvedPromises) {
      assert.ok(resolvedPromises, 'All records saved.');

      visit(path);
      andThen(function() {
        assert.equal(currentPath(), path);

        let $choosedIthem;
        let trTableBody;
        let activeItem;

        // Refresh function.
        let refreshFunction =  function() {
          let $folvPerPageButton = $('.flexberry-dropdown.compact');
          let $menu = $('.menu', $folvPerPageButton);
          trTableBody = () => { return $($('table.object-list-view tbody tr')).length.toString(); };

          activeItem =  () => { return $($('.item.active.selected', $menu)).text(); };

          // The list should be more than 5 items.
          assert.equal(activeItem(), trTableBody(), 'equal perPage and visible element count');
          $folvPerPageButton.click();
          let timeout = 500;
          later((() => {
            let menuIsVisible = $menu.hasClass('visible');
            assert.strictEqual(menuIsVisible, true, 'menu is visible');
            $choosedIthem = $('.item', $menu);
            $choosedIthem[1].click();
          }), timeout);
        };

        let controller = app.__container__.lookup('controller:' + currentRouteName());
        let done = assert.async();
        refreshListByFunction(refreshFunction, controller).then(() => {
          // The list should be more than 10 items
          assert.equal(activeItem(), trTableBody(), 'equal perPage and visible element count');
        }).catch((reason) => {
          throw new Error(reason);
        }).finally(() => {
          deleteRecords(store, modelName, uuid, assert);
          done();
        });
      });
    });
  });
});
