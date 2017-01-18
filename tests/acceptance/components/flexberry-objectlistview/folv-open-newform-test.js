import Ember from 'ember';
import { executeTest, loadingList } from './execute-folv-test';

executeTest('check goto new form', (store, assert) => {
  assert.expect(4);
  let path = 'components-acceptance-tests/flexberry-objectlistview/base-operations';
  visit(path);
  andThen(function() {
    assert.equal(currentPath(), path);
    let $toolBar = Ember.$('.ui.secondary.menu')[0];
    let $toolBarButtons = $toolBar.children;

    assert.equal($toolBarButtons[1].innerText, 'Добавить', 'button create exist');

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
