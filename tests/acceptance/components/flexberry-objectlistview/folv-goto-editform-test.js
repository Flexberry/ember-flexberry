import Ember from 'ember';
import { executeTest, loadingList } from './execute-folv-test';

executeTest('check goto editform', (store, assert, app) => {
  assert.expect(5);
  let path = 'components-acceptance-tests/flexberry-objectlistview/base-operations';
  visit(path);
  andThen(function() {
    assert.equal(currentPath(), path);

    let controller = app.__container__.lookup('controller:' + currentRouteName());
    let $trTableBody = Ember.$('tr', 'tbody', '.object-list-view-container');

    assert.equal(currentPath(), path, 'edit form not open');

    let asyncOperationsCompleted = assert.async();
    let $cell = $trTableBody[0].children[1];

    $cell.click();

    let timeout = 2000;
    Ember.run.later((function() {
      assert.equal(currentPath(), path, 'edit form not open');
      controller.set('rowClickable', true);
      Ember.run.later((function() {

        loadingList($cell, 'form', '.field').then(($editForm) => {
          assert.ok($editForm, 'edit form open');
          assert.equal(currentPath(), 'ember-flexberry-dummy-suggestion-edit', 'edit form path');
        }).catch((reason) => {
          throw new Error(reason);
        }).finally(() => {
          asyncOperationsCompleted();
        });

      }), timeout);
    }), timeout);
  });
});
