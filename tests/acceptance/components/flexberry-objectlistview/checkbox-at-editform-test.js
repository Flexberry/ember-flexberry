import Ember from 'ember';
import { executeTest } from './execute-folv-test';
import { loadingList } from './folv-tests-functions';

executeTest('check checkbox at editform', (store, assert, app) => {
  assert.expect(2);
  let path = 'components-acceptance-tests/flexberry-checkbox/ember-flexberry-dummy-suggestion-list-with-checked-checkbox';
  visit(path);
  andThen(function() {

    let controller = app.__container__.lookup('controller:' + currentRouteName());
    let $folvContainer = Ember.$('.object-list-view-container');
    let $trTableBody = Ember.$('table.object-list-view tbody tr', $folvContainer);
    let $cell = $trTableBody[0].children[1];

    $cell.click();

    let timeout = 500;
    Ember.run.later((function() {
      controller.set('rowClickable', true);
      Ember.run.later((function() {
        let asyncOperationsCompleted = assert.async();
        loadingList($cell, 'form.flexberry-vertical-form', '.field').then(($editForm) => {
          let checkbox = Ember.$('.flexberry-checkbox');

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
