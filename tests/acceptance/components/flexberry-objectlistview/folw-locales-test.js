import Ember from 'ember';
import { executeTest } from './execute-folv-test';
import I18nRuLocale from 'ember-flexberry/locales/ru/translations';
import I18nEnLocale from 'ember-flexberry/locales/en/translations';

executeTest('check locale change', (store, assert, app) => {
  assert.expect(11);
  let path = 'components-acceptance-tests/flexberry-objectlistview/base-operations';
  visit(path);
  andThen(() => {

    // Set 'ru' as current locale.
    let i18n = app.__container__.lookup('service:i18n');
    i18n.set('locale', 'ru');

    assert.equal(currentPath(), path);

    let $toolBar = Ember.$('.ui.secondary.menu')[0];
    let $toolBarButtons = $toolBar.children;

    function toolbarBtnTextAssert(currentLocale) {
      assert.notEqual($toolBarButtons.length, 0, 'buttons in toolbar exists');
      assert.equal($toolBarButtons[0].innerText, Ember.get(currentLocale, 'components.olv-toolbar.refresh-button-text'), 'button refresh exist');
      assert.equal($toolBarButtons[1].innerText, Ember.get(currentLocale, 'components.olv-toolbar.add-button-text'), 'button create exist');
      assert.equal($toolBarButtons[2].innerText, Ember.get(currentLocale, 'components.olv-toolbar.delete-button-text'), 'button delete exist');
      assert.equal($($toolBarButtons[2]).hasClass('disabled'), true, 'button delete is disabled');
    }

    toolbarBtnTextAssert(I18nRuLocale);

    // En
    i18n.set('locale', 'en');

    let timeout = 2000;
    Ember.run.later((() => {
      toolbarBtnTextAssert(I18nEnLocale);
    }), timeout);

  });
});
