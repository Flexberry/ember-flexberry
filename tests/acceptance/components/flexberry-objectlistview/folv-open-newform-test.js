import $ from 'jquery';
import { get } from '@ember/object';
import { executeTest } from './execute-folv-test';
import { loadingList, loadingLocales } from './folv-tests-functions';

import I18nRuLocale from 'ember-flexberry/locales/ru/translations';

executeTest('check goto new form', (store, assert, app) => {
  assert.expect(4);
  let path = 'components-acceptance-tests/flexberry-objectlistview/base-operations';
  visit(path);
  andThen(function() {

    // Set 'ru' as current locale.
    loadingLocales('ru', app).then(() => {
      assert.equal(currentPath(), path);
      let $toolBar = $('.ui.secondary.menu')[0];
      let $toolBarButtons = $toolBar.children;

      assert.equal($toolBarButtons[1].innerText, get(I18nRuLocale, 'components.olv-toolbar.add-button-text'), 'button create exist');

      let asyncOperationsCompleted = assert.async();
      loadingList($toolBarButtons[1], 'form', '.field').then(($editForm) => {
        assert.ok($editForm, 'new form open');
        assert.equal(currentPath(), 'ember-flexberry-dummy-suggestion-edit.new', 'new form open');
      }).catch((reason) => {
        throw new Error(reason);
      }).finally(() => {
        asyncOperationsCompleted();
      });
    });
  });
});
