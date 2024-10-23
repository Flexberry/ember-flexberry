import { run } from '@ember/runloop';
import $ from 'jquery';
import { executeTest } from './execute-validation-test';

/* eslint-disable no-unused-vars */
executeTest('check detail\'s components', async (store, assert, app) => {
  assert.expect(3);
  let path = 'components-acceptance-tests/edit-form-validation/validation';

  // Open validation page.
  await visit(path);

  assert.equal(currentPath(), path);

  // Сounting the number of validationmessage.
  let $validationLablesContainer = $('.ember-view.ui.basic.label');
  assert.equal($validationLablesContainer.length, 11, 'All components have default value');

  let $validationFlexberryCheckboxs = $('.flexberry-checkbox');
  let $validationFlexberryOLVCheckbox = $($validationFlexberryCheckboxs[2]);

  let $validationFlexberryTextboxs = $('.flexberry-textbox');
  let $validationFlexberryOLVTextbox1 = $($validationFlexberryTextboxs[2]);
  let $validationFlexberryOLVTextbox2 = $($validationFlexberryTextboxs[3]);

  // Selct textbox inner.
  let $validationFlexberryTextboxInner1 = $validationFlexberryOLVTextbox1.children('input');
  let $validationFlexberryTextboxInner2 = $validationFlexberryOLVTextbox2.children('input');

  // Select deteil's validationmessages.
  let $validationField1 = $($validationLablesContainer[8]);
  let $validationField2 = $($validationLablesContainer[9]);
  let $validationField3 = $($validationLablesContainer[10]);

  // Data insertion.
  run(async () => {
    $validationFlexberryOLVCheckbox.click();
    $validationFlexberryTextboxInner1[0].value = '1';
    $validationFlexberryTextboxInner1.change();
    $validationFlexberryTextboxInner2[0].value = '12345';
    $validationFlexberryTextboxInner2.change();
  });

  // Validationmessage must be empty.
  assert.ok(
    $validationField1.text().trim() === '' &&
    $validationField2.text().trim() === '' &&
    $validationField3.text().trim() === '',
    'All components have default value');
});
/* eslint-enable no-unused-vars */
