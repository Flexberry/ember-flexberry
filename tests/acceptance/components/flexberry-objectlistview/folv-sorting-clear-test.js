import $ from 'jquery';
import { get } from '@ember/object';
import { run } from '@ember/runloop';
import { executeTest } from './execute-folv-test';
import { checkSortingList, loadingLocales, refreshListByFunction, getOrderByClause } from './folv-tests-functions';

import I18nRuLocale from 'ember-flexberry/locales/ru/translations';

// Need to add sort by multiple columns.
executeTest('check sorting clear', async (store, assert, app) => {
  assert.expect(8);
  let path = 'components-acceptance-tests/flexberry-objectlistview/base-operations';
  await visit(path);
  await click('.ui.clear-sorting-button');

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

  // Check sortihg in the first column. Sorting is not append.
  await loadingLocales('ru', app);
  let isTrue = await checkSortingList(store, projectionName, $olv, orderByClause);
  assert.ok(isTrue, 'sorting is not applied');

  // Check sortihg icon in the first column. Sorting icon is not added.
  assert.equal($thead.children[0].children.length, 1, 'no sorting icon in the first column');

  // Refresh function.
  let refreshFunction =  async function() {
    await click( $thead);
  };
  await refreshListByFunction(refreshFunction, controller)
  $thead = $('th.dt-head-left', $olv)[0];
  let $ord = $('.object-list-view-order-icon', $thead);
  let $divOrd = $('div', $ord);

  assert.equal($divOrd.attr('title'), get(I18nRuLocale, 'components.object-list-view.sort-ascending'), 'title is Order ascending');
  assert.equal($('.icon', $divOrd).hasClass('ascending'), true, 'sorting symbol added');

  isTrue = await checkSortingList(store, projectionName, $olv, 'address asc');
  assert.ok(isTrue, 'sorting applied');

  let refreshFunction2 = async function() {
    let $clearButton = $('.clear-sorting-button');
    await click($clearButton);
  };

  await refreshListByFunction(refreshFunction2, controller);

  $thead = $('th.dt-head-left', $olv)[0];
  $ord = $('.object-list-view-order-icon', $thead);
  $divOrd = $('div', $ord);

  assert.equal($divOrd.attr('title'), undefined, 'sorting are clear');
  assert.equal($.trim($divOrd.text()), '', 'sorting symbol delete');
});