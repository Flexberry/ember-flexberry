import $ from 'jquery';
import { executeTest } from './execute-validation-test';

/* eslint-disable no-unused-vars */
executeTest('check default value', async (store, assert, app) => {
  assert.expect(3);
  let path = 'components-acceptance-tests/edit-form-validation/validation';

  // Open validation page.
  await visit(path);

  assert.equal(currentPath(), path);

  let $validationLablesContainer = $('.ember-view.ui.basic.label');
  let $validationSixteenWide = $('.list');
  let $validationLi = $validationSixteenWide.children('li');

  // Сounting the number of validationmessage.
  assert.equal($validationLablesContainer.length, 11, 'All components have default value');
  assert.equal($validationLi.length, 17, 'All components have default value in sixteenWide');
});
/* eslint-enable no-unused-vars */
