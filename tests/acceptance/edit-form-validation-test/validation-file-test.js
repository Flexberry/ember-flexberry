import $ from 'jquery';
import { executeTest } from './execute-validation-test';

/* eslint-disable no-unused-vars */
executeTest('check operation file', async (store, assert, app) => {
  assert.expect(3);
  let path = 'components-acceptance-tests/edit-form-validation/validation';

  await visit(path);

  assert.equal(currentPath(), path);

  let $validationFieldFile = $($('.field')[7]);
  let $validationFlexberryErrorLable = $validationFieldFile.children('.label');

  // Check default validationmessage text.
  assert.equal($validationFlexberryErrorLable.text().trim(), 'File is required', 'Flexberry file have default value');

  let $validationFlexberryLookupButton = $('.ui.button.ui-change')[0];

  // Click lookup button.
  await click($validationFlexberryLookupButton);

  // Сounting the number of validationmessage.
  await new Promise(resolve => setTimeout(resolve, 2000));
  assert.equal($validationFlexberryErrorLable.text().trim(), '', 'Flexberry file have value');
});
/* eslint-enable no-unused-vars */
