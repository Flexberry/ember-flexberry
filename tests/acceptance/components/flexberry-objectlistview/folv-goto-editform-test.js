import Ember from 'ember';
import { executeTest } from './execute-folv-test';
import { loadingList } from './folv-tests-functions';

executeTest('check goto editform', (store, assert, app) => {
  assert.expect(5);
  let path = 'components-acceptance-tests/flexberry-objectlistview/base-operations';
  visit(path);
  andThen(function() {
    assert.equal(currentPath(), path);

    let controller = app.__container__.lookup('controller:' + currentRouteName());
    let $folvContainer = Ember.$('.object-list-view-container');
    let $trTableBody = Ember.$('table.object-list-view tbody tr', $folvContainer);
    let $cell = $trTableBody[0].children[1];

    assert.equal(currentPath(), path, 'edit form not open');
    $cell.click();

    let timeout = 500;
    Ember.run.later((function() {
      assert.equal(currentPath(), path, 'edit form not open');
      controller.set('rowClickable', true);
      Ember.run.later((function() {
        let asyncOperationsCompleted = assert.async();
        loadingList($cell, 'form.flexberry-vertical-form', '.field').then(($editForm) => {
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
