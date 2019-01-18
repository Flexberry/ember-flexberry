import $ from 'jquery';
import { get } from '@ember/object';
import { run } from '@ember/runloop';
import { executeTest } from './execute-folv-test';
import { checkSortingList, loadingLocales, refreshListByFunction, getOrderByClause } from './folv-tests-functions';

import I18nRuLocale from 'ember-flexberry/locales/ru/translations';

// Need to add sort by multiple columns.
executeTest('check sorting', (store, assert, app) => {
  assert.expect(14);
  let path = 'components-acceptance-tests/flexberry-objectlistview/base-operations';
  visit(path);
  click('.ui.clear-sorting-button');
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
          assert.equal(controller.sort, undefined, 'no sorting in URL');

          // Refresh function.
          let refreshFunction =  function() {
            $thead.click();
          };

          let done1 = assert.async();
          refreshListByFunction(refreshFunction, controller).then(() => {
            let $thead = $('th.dt-head-left', $olv)[0];
            let $ord = $('.object-list-view-order-icon', $thead);
            let $divOrd = $('div', $ord);

            assert.equal($divOrd.attr('title'), get(I18nRuLocale, 'components.object-list-view.sort-ascending'), 'title is Order ascending');
            assert.equal($.trim($divOrd.text()), String.fromCharCode('9650') + '1', 'sorting symbol added');
            assert.equal(controller.sort, '+address', 'up sorting in URL');

            let done2 = assert.async();
            checkSortingList(store, projectionName, $olv, 'address asc').then((isTrue) => {
              assert.ok(isTrue, 'sorting applied');
              let done3 = assert.async();
              refreshListByFunction(refreshFunction, controller).then(() => {
                let $thead = $('th.dt-head-left', $olv)[0];
                let $ord = $('.object-list-view-order-icon', $thead);
                let $divOrd = $('div', $ord);

                assert.equal($divOrd.attr('title'), get(I18nRuLocale, 'components.object-list-view.sort-descending'), 'title is Order descending');
                assert.equal($.trim($divOrd.text()), String.fromCharCode('9660') + '1', 'sorting symbol changed');
                assert.equal(controller.sort, '-address', 'down sorting in URL');

                let done4 = assert.async();
                checkSortingList(store, projectionName, $olv, 'address desc').then((isTrue) => {
                  assert.ok(isTrue, 'sorting applied');

                  let done5 = assert.async();
                  refreshListByFunction(refreshFunction, controller).then(() => {
                    assert.equal(controller.sort, null, 'no sorting in URL');
                    let done6 = assert.async();
                    refreshListByFunction(refreshFunction, controller).then(() => {
                      assert.equal(controller.sort, '+address', 'up sorting in URL');
                      done6();
                    });
                    done5();
                  });
                  done4();
                });
              }).finally(() => {
                done3();
              });
              done2();
            });
            done1();
          });
          done();
        });
      });
    });
  });
});
