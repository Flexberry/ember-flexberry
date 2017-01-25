import Ember from 'ember';
import { executeTest } from './execute-folv-test';

executeTest('check locale change', (store, assert, app) => {
  assert.expect(11);
  let path = 'components-acceptance-tests/flexberry-objectlistview/base-operations';
  visit(path);
  andThen(() => {
    assert.equal(currentPath(), path);

    let $toolBar = Ember.$('.ui.secondary.menu')[0];
    let $toolBarButtons = $toolBar.children;

    assert.notEqual($toolBarButtons.length, 0, 'buttons in toolbar exists');
    assert.equal($toolBarButtons[0].innerText, 'Обновить', 'button refresh exist');
    assert.equal($toolBarButtons[1].innerText, 'Добавить', 'button create exist');
    assert.equal($toolBarButtons[2].innerText, 'Удалить', 'button delete exist');
    assert.equal($($toolBarButtons[2]).hasClass('disabled'), true, 'button delete is disabled');

    // En
    let i18n = app.__container__.lookup('service:i18n');
    i18n.set('locale', 'en');

    let timeout = 2000;
    Ember.run.later((() => {
      assert.notEqual($toolBarButtons.length, 0, 'buttons in toolbar exists');
      assert.equal($toolBarButtons[0].innerText, 'Refresh', 'button refresh');
      assert.equal($toolBarButtons[1].innerText, 'Add', 'button create');
      assert.equal($toolBarButtons[2].innerText, 'Delete', 'button delete');
      assert.equal($($toolBarButtons[2]).hasClass('disabled'), true, 'button delete is disabled');
    }), timeout);

  });
});
