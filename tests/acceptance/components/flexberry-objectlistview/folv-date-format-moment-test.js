import $ from 'jquery';
import { get } from '@ember/object';
import { executeTest } from './execute-folv-test';
import { loadingLocales, refreshListByFunction } from './folv-tests-functions';

import I18nRuLocale from 'ember-flexberry/locales/ru/translations';

executeTest('date format moment L', async (store, assert, app) => {
  assert.expect(5);
  const path = 'components-acceptance-tests/flexberry-objectlistview/base-operations';
  
  await visit(path);
  assert.equal(currentPath(), path, 'Correct path is visited');

  await loadingLocales('ru', app);

  const olvContainerClass = '.object-list-view-container';
  const $toolBar = $('.ui.secondary.menu')[0];
  const $refreshButton = $toolBar.children[0];

  assert.equal($refreshButton.innerText.trim(), get(I18nRuLocale, 'components.olv-toolbar.refresh-button-text'), 'Button refresh exists');

  const controller = app.__container__.lookup('controller:' + currentRouteName());

  const refreshFunction = () => {
    const refreshButton = $('.refresh-button')[0];
    refreshButton.click();
  };

  await refreshListByFunction(refreshFunction, controller);

  const moment = app.__container__.lookup('service:moment');
  const momentValue = get(moment, 'defaultFormat');
  assert.equal(momentValue, 'L', 'Moment value is \'L\'');

  const $folvContainer = $(olvContainerClass);
  const $table = $('table.object-list-view', $folvContainer);
  const $headRow = $('thead tr', $table)[0].children;

  const indexDate = () => {
    for (let index = 0; index < $headRow.length; index++) {
      const $dateAttribute = $($headRow[index]).children('div');
      if ($dateAttribute.length !== 0 && $.trim($dateAttribute[0].getAttribute('data-olv-header-property-name')) === 'date') {
        return index;
      }
    }
    return -1; // Если не найдено
  };

  const $dateCell = () => $.trim($('tbody tr', $table)[0].children[indexDate()].innerText);

  // Date format must be DD.MM.YYYY
  const dateFormatRuRe = /(0[1-9]|[12][0-9]|3[01])\.(0[1-9]|1[012])\.(19|20)\d\d/;
  const findDateRu = dateFormatRuRe.exec($dateCell());

  assert.ok(findDateRu, 'Date format is \'DD.MM.YYYY\'');

  await loadingLocales('en', app);

  await refreshListByFunction(refreshFunction, controller);

  // Date format must be MM/DD/YYYY
  const dateFormatEnRe = /(0[1-9]|1[012])\/(0[1-9]|[12][0-9]|3[01])\/(19|20)\d\d/;
  const dataCellStr = $dateCell();
  const findDateEn = dateFormatEnRe.exec(dataCellStr);

  assert.ok(findDateEn, 'Date format is \'MM/DD/YYYY\'');
});
