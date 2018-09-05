import $ from 'jquery';
import { executeTest } from './execute-folv-test';
import { openEditFormByFunction, refreshListByFunction } from './folv-tests-functions';

executeTest('check return from editForm with queryParam', (store, assert, app) => {
  assert.expect(2);
  let path = 'components-examples/flexberry-objectlistview/return-with-query-params/ember-flexberry-dummy-suggestion-return-with-query-params-list?perPage=5';
  visit(path);
  andThen(() => {
    let controller = app.__container__.lookup('controller:' + currentRouteName());

    // Open editFirn function.
    let openEditFormFunction =  function() {
      let editButtonInRow = $('.object-list-view-row-edit-button')[0];
      editButtonInRow.click();
    };

    // Return to listform  function.
    let returnToListFormFunction =  function() {
      let returnToListFormButton = $('.return-to-list-form')[0];
      returnToListFormButton.click();
    };

    // Open editform.
    let done = assert.async();
    openEditFormByFunction(openEditFormFunction).then(() => {
      assert.ok(true, 'edit form open');

      refreshListByFunction(returnToListFormFunction, controller).then(() => {
        assert.equal(controller.model.content.length, 1, 'QueryParams applied successfully');
        done();
      });
    });
  });
});
