import { run } from '@ember/runloop';
import $ from 'jquery';
import { get } from '@ember/object';
import { executeTest } from './execute-folv-test';
import { loadingList, checkSortingList, loadingLocales, getOrderByClause } from './folv-tests-functions';

var olvContainerClass = '.object-list-view-container';
var trTableClass = 'table.object-list-view tbody tr';

// Need to add sort by multiple columns.
executeTest('check select all at page', (store, assert, app) => {
  assert.expect(8);
  let path = 'components-acceptance-tests/flexberry-objectlistview/base-operations';
  visit(path);
  andThen(() => {

    // Check page path.
    assert.equal(currentPath(), path);
    let controller = app.__container__.lookup('controller:' + currentRouteName());
    let projectionName = get(controller, 'modelProjection');

    let orderByClause = null;

    let $olv = $('.object-list-view ');
    let $thead = $('th.dt-head-left', $olv)[0];

    let currentSorting = controller.get('computedSorting');
    if (!$.isEmptyObject(currentSorting)) {
      orderByClause = getOrderByClause(currentSorting);
    }

    run(() => {
      let done = assert.async();

      // Check sortihg in the first column. Sorting is not append.
      loadingLocales('ru', app).then(() => {
        checkSortingList(store, projectionName, $olv, orderByClause).then((isTrue) => {
          assert.ok(isTrue, 'sorting is not applied');

          // Check sortihg icon in the first column. Sorting icon is not added.
          assert.equal($thead.children[0].children.length, 1, 'no sorting icon in the first column');
          let done1 = assert.async();
          loadingList($thead, olvContainerClass, trTableClass).then(($list) => {

            assert.ok($list);

            let $checkAllAtPageButton = $('.check-all-at-page-button');
            $checkAllAtPageButton.click();
            let $deleteButton = $('.delete-button');
            let $checkCheckBox = $('.flexberry-checkbox.checked');

            // Check afther select all at page.
            assert.equal($checkCheckBox.length, 5, 'all checkBox in row are select');
            assert.equal($deleteButton.hasClass('disabled'), false, 'delete are available');

            $checkAllAtPageButton.click();
            $checkCheckBox = $('.flexberry-checkbox.checked');

            // Check afther unselect all at page.
            assert.equal($checkCheckBox.length, 0, 'all checkBox in row are unselect');
            assert.equal($deleteButton.hasClass('disabled'), true, 'delete aren\'t available');

            done1();
          });
          done();
        });
      });
    });
  });
});
