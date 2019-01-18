import $ from 'jquery';
import { later } from '@ember/runloop';
import { executeTest } from './execute-folv-test';
import { loadingList } from './folv-tests-functions';

executeTest('check goto editform', (store, assert, app) => {
  assert.expect(5);
  let path = 'components-acceptance-tests/flexberry-objectlistview/base-operations';
  visit(path);
  andThen(function() {
    assert.equal(currentPath(), path);

    let controller = app.__container__.lookup('controller:' + currentRouteName());
    let $folvContainer = $('.object-list-view-container');
    let $trTableBody = $('table.object-list-view tbody tr', $folvContainer);
    let $cell = $trTableBody[0].children[1];

    assert.equal(currentPath(), path, 'edit form not open');

    let timeout = 500;
    later((function() {
      assert.equal(currentPath(), path, 'edit form not open');
      controller.set('rowClickable', true);
      later((function() {
        let asyncOperationsCompleted = assert.async();
        loadingList($cell, 'form.flexberry-vertical-form', '.field').then(($editForm) => {
          assert.ok($editForm, 'edit form open');
          assert.equal(currentPath(), 'ember-flexberry-dummy-suggestion-edit', 'edit form path');
        }).catch((reason) => {
          // Error output.
          assert.ok(false, reason);
        }).finally(() => {
          asyncOperationsCompleted();
        });

      }), timeout);
    }), timeout);
  });
});
