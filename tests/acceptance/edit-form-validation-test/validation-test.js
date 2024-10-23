import { run } from '@ember/runloop';
import $ from 'jquery';
import { executeTest } from './execute-validation-test';

/* eslint-disable no-unused-vars */
executeTest('check complete all tests', async (store, assert, app) => {
  assert.expect(3);
  let path = 'components-acceptance-tests/edit-form-validation/validation';

  // Open validation page.
  await visit(path);

  assert.equal(currentPath(), path);

  let $validationFlexberryLookupButton = $('.ui.button.ui-change')[0];

  // Click lookup button.
  run(async () => {
    await click($validationFlexberryLookupButton);
  });

  let $validationFlexberryCheckboxs = $('.flexberry-checkbox');
  let $validationFlexberryCheckbox = $($validationFlexberryCheckboxs[0]);
  let $validationFlexberryOLVCheckbox = $($validationFlexberryCheckboxs[2]);

  run(async () => {
    await click($validationFlexberryCheckbox);
    await click($validationFlexberryOLVCheckbox);
  });

  let $validationFlexberryDropdown = $('.flexberry-dropdown');

  run(async () => {

    // Open dropdown.
    await click($validationFlexberryDropdown);
    let $validationFlexberryDropdownMenu = $validationFlexberryDropdown.children('.menu');
    let $validationFlexberryDropdownItems = $validationFlexberryDropdownMenu.children('.item');
    let $validationFlexberryDropdownItem = $($validationFlexberryDropdownItems[0]);

    // Select item
    await click($validationFlexberryDropdownItem)
  });

  let $validationFlexberryTextboxs = $('.flexberry-textbox');
  let $validationFlexberryTextbox1 = $($validationFlexberryTextboxs[0]);
  let $validationFlexberryTextbox2 = $($validationFlexberryTextboxs[1]);
  let $validationFlexberryOLVTextbox1 = $($validationFlexberryTextboxs[2]);
  let $validationFlexberryOLVTextbox2 = $($validationFlexberryTextboxs[3]);
  let $validationFlexberryTextarea = $('.flexberry-textarea');

  let $validationFlexberryTextboxInner1 = $validationFlexberryTextbox1.children('input');
  let $validationFlexberryTextboxInner2 = $validationFlexberryTextbox2.children('input');
  let $validationFlexberryOLVTextboxInner1 = $validationFlexberryOLVTextbox1.children('input');
  let $validationFlexberryOLVTextboxInner2 = $validationFlexberryOLVTextbox2.children('input');
  let $validationFlexberryTextAreaInner = $validationFlexberryTextarea.children('textarea');

  // Insert text in textbox and textarea.
  run(async () => {
    $validationFlexberryTextboxInner1[0].value = '1';
    $validationFlexberryTextboxInner1.change();
    $validationFlexberryTextboxInner2[0].value = '12345';
    $validationFlexberryTextboxInner2.change();
    $validationFlexberryTextAreaInner.val('1');
    $validationFlexberryTextAreaInner.change();
    $validationFlexberryOLVTextboxInner1[0].value = '1';
    $validationFlexberryOLVTextboxInner1.change();
    $validationFlexberryOLVTextboxInner2[0].value = '12345';
    $validationFlexberryOLVTextboxInner2.change();
  });

  let $validationFlexberryFileAddButton = $('.add.outline');

  run(async () => {
    await click($validationFlexberryFileAddButton);
  });

  // Сounting the number of validationmessage.
  await new Promise((resolve) => setTimeout(resolve, 5000));

  let $validationLablesContainer = $('.ember-view.ui.basic.label');
  let $validationMessage = true;

  for (let i = 0; i < 10; i++) {
    if ($validationLablesContainer[i].textContent.trim() !== '') {
      $validationMessage = false;
    }
  }

  let $validationSixteenWide = $('.list');
  let $validationLi = $validationSixteenWide.children('li');

  // Сounting the number of validationmessage.
  assert.equal($validationLi.length, 0, 'All components have default value in sixteenWide');

  assert.ok($validationMessage, 'All components have correct value, All validationmessage disabled');
});
/* eslint-enable no-unused-vars */
