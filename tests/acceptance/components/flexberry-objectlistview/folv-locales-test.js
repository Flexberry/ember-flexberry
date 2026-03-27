import $ from 'jquery';
import { get } from '@ember/object';
import { executeTest } from './execute-folv-test';
import { loadingLocales } from './folv-tests-functions';

import I18nRuLocale from 'ember-flexberry/locales/ru/translations';
import I18nEnLocale from 'ember-flexberry/locales/en/translations';

executeTest('check locale change', async (store, assert, app) => {
  assert.expect(11);
  const path = 'components-acceptance-tests/flexberry-objectlistview/base-operations';
  await visit(path);

  assert.equal(currentPath(), path);

  async function toolbarBtnTextAssert(currentLocale) {
    assert.notEqual($toolBarButtons.length, 0, 'buttons in toolbar exists');
    assert.equal($toolBarButtons[0].innerText.trim(), get(currentLocale, 'components.olv-toolbar.refresh-button-text'), 'button refresh exist');
    assert.equal($toolBarButtons[1].innerText.trim(), get(currentLocale, 'components.olv-toolbar.add-button-text'), 'button create exist');
    assert.equal($toolBarButtons[2].innerText.trim(), get(currentLocale, 'components.olv-toolbar.delete-button-text'), 'button delete exist');
    assert.equal($($toolBarButtons[2]).hasClass('disabled'), true, 'button delete is disabled');
  }

  const $toolBar = $('.ui.secondary.menu')[0];
  const $toolBarButtons = $toolBar.children;

  // Set 'ru' as current locale.
  await loadingLocales('ru', app)
  await toolbarBtnTextAssert(I18nRuLocale);
  await loadingLocales('en', app)
  await toolbarBtnTextAssert(I18nEnLocale);
});

