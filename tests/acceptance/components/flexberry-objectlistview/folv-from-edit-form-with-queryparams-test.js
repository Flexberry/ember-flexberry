import { executeTest } from './execute-folv-test';
import { openEditFormByFunction, refreshListByFunction } from './folv-tests-functions';

executeTest('check return from editForm with queryParam', async (store, assert, app) => {
  assert.expect(2);
  const path = 'components-examples/flexberry-objectlistview/return-with-query-params/ember-flexberry-dummy-suggestion-return-with-query-params-list?perPage=5';
  
  await visit(path);
  
  const controller = app.__container__.lookup('controller:' + currentRouteName());

  // Open edit form function.
  const openEditFormFunction = () => {
    const editButtonInRow = document.querySelector('.object-list-view-row-edit-button');
    return click(editButtonInRow);
  };

  // Return to list form function.
  const returnToListFormFunction = () => {
    const returnToListFormButton = document.querySelector('.return-to-list-form');
    return click(returnToListFormButton);
  };

  // Open edit form.
  await openEditFormByFunction(openEditFormFunction);
  assert.ok(true, 'Edit form opened');

  await refreshListByFunction(returnToListFormFunction, controller);
  assert.equal(controller.model.content.length, 1, 'QueryParams applied successfully');
});
