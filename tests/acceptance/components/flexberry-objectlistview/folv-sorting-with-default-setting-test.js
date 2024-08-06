import { get } from '@ember/object';
import { run } from '@ember/runloop';
import { executeTest } from './execute-folv-test';
import { loadingLocales, refreshListByFunction } from './folv-tests-functions';
import $ from 'jquery';

import I18nRuLocale from 'ember-flexberry/locales/ru/translations';

// Need to add sort by multiple columns.
executeTest('check sorting with default setting', async (store, assert, app) => {
  assert.expect(9);
  let path = 'components-acceptance-tests/flexberry-objectlistview/folv-paging';
  await visit(path);
  await click('.ui.clear-sorting-button');

  // Check page path.
  assert.equal(currentPath(), path);
  let controller = app.__container__.lookup('controller:' + currentRouteName());

  let $olv = $('.object-list-view ');

  await run(async () => {
  await loadingLocales('ru', app);
  // Refresh function.
  let refreshFunction = async function () {
    let $thead = $('th.dt-head-left', $olv)[0];
    click($($thead));
  };

  let $thead = $('th.dt-head-left', $olv)[0];
  let $ord = $('.object-list-view-order-icon', $thead);
  let $divOrd = $('div', $ord);

  assert.equal($divOrd.attr('title'), get(I18nRuLocale, 'components.object-list-view.sort-ascending'), 'title is Order ascending');
  assert.equal($('.icon', $divOrd).hasClass('ascending'), true, 'sorting symbol added');
  assert.equal(controller.sort, '+name', 'up sorting in URL');

  await refreshListByFunction(refreshFunction, controller);

  $thead = $('th.dt-head-left', $olv)[0];
  $ord = $('.object-list-view-order-icon', $thead);
  $divOrd = $('div', $ord);

  assert.equal($divOrd.attr('title'), get(I18nRuLocale, 'components.object-list-view.sort-descending'), 'title is Order descending');
  assert.equal($('.icon', $divOrd).hasClass('descending'), true, 'sorting symbol changed');
  assert.equal(controller.sort, '-name', 'down sorting in URL');

  await refreshListByFunction(refreshFunction, controller);
  assert.equal(controller.sort, null, 'no sorting in URL');

  await refreshListByFunction(refreshFunction, controller);
  assert.equal(controller.sort, '+name', 'up sorting in URL');
  });
});