import Ember from 'ember';
import { executeTest } from './execute-folv-test';

import I18nRuLocale from 'ember-flexberry/locales/ru/translations';
import I18nEnLocale from 'ember-flexberry/locales/en/translations';

executeTest('check locale change', (store, assert, app) => {
  assert.expect(11);
  let path = 'components-acceptance-tests/flexberry-objectlistview/base-operations';
  visit(path);
  andThen(() => {
    assert.equal(currentPath(), path);

    function loadingLocales(locale) {
      return new Ember.RSVP.Promise((resolve) => {
        let i18n = app.__container__.lookup('service:i18n');

        Ember.run(() => {
          i18n.set('locale', locale);
        });

        let timeout = 500;
        Ember.run.later((() => {
          resolve({ msg: 'ok' });
        }), timeout);
      });
    }

    function toolbarBtnTextAssert(currentLocale) {
      assert.notEqual($toolBarButtons.length, 0, 'buttons in toolbar exists');
      assert.equal($toolBarButtons[0].innerText, Ember.get(currentLocale, 'components.olv-toolbar.refresh-button-text'), 'button refresh exist');
      assert.equal($toolBarButtons[1].innerText, Ember.get(currentLocale, 'components.olv-toolbar.add-button-text'), 'button create exist');
      assert.equal($toolBarButtons[2].innerText, Ember.get(currentLocale, 'components.olv-toolbar.delete-button-text'), 'button delete exist');
      assert.equal($($toolBarButtons[2]).hasClass('disabled'), true, 'button delete is disabled');
    }

    let $toolBar = Ember.$('.ui.secondary.menu')[0];
    let $toolBarButtons = $toolBar.children;

    // Set 'ru' as current locale.
    loadingLocales('ru').then(() => {
      toolbarBtnTextAssert(I18nRuLocale);
      loadingLocales('en').then(() => {
        toolbarBtnTextAssert(I18nEnLocale);
      });
    });
  });
});
