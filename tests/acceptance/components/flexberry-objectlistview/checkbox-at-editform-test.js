import $ from 'jquery';
import { later } from '@ember/runloop';
import { executeTest } from './execute-folv-test';
import { loadingList } from './folv-tests-functions';

executeTest('check checkbox at editform', (store, assert, app) => {
  assert.expect(2);
  let path = 'components-acceptance-tests/flexberry-checkbox/ember-flexberry-dummy-suggestion-list-with-checked-checkbox';
  visit(path);
  andThen(function() {

    let controller = app.__container__.lookup('controller:' + currentRouteName());
    let $folvContainer = $('.object-list-view-container');
    let $trTableBody = $('table.object-list-view tbody tr', $folvContainer);
    let $cell = $trTableBody[0].children[1];

    let timeout = 500;
    later((function() {
      controller.set('rowClickable', true);
      later((function() {
        let asyncOperationsCompleted = assert.async();
        loadingList($cell, 'form.flexberry-vertical-form', '.field').then(($editForm) => {
          let checkbox = $('.flexberry-checkbox');

          assert.ok($editForm, 'edit form open');
          assert.equal(checkbox.hasClass('checked'), true, 'checkbox is check');
        }).catch((reason) => {
          throw new Error(reason);
        }).finally(() => {
          asyncOperationsCompleted();
        });

      }), timeout);
    }), timeout);
  });
});
