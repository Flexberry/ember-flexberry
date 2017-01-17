import Ember from 'ember';
import { executeTest } from './execute-folv-test';

executeTest('toolbar buttons location', (store, assert, app) => {
  assert.expect(6);
  let path = 'components-acceptance-tests/flexberry-objectlistview/base-operations';
  visit(path);
  andThen(function() {
    assert.equal(currentPath(), path);

    let $toolBar = Ember.$('.ui.secondary.menu')[0];
    let $toolBarButtons = $toolBar.children;

    assert.notEqual($toolBarButtons.length, 0, 'buttons in toolbar exists');
    assert.equal($toolBarButtons[0].innerText, 'Обновить', 'button refresh exist');
    assert.equal($toolBarButtons[1].innerText, 'Добавить', 'button create exist');
    assert.equal($toolBarButtons[2].innerText, 'Удалить', 'button delete exist');
    assert.equal($($toolBarButtons[2]).hasClass('disabled'), true, 'button delete is disabled');
  });
});
