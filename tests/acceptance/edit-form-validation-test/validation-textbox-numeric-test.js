import { run } from '@ember/runloop';
import $ from 'jquery';
import { executeTest} from './execute-validation-test';

/* eslint-disable no-unused-vars */
executeTest('check operation numeric textbox', (store, assert, app) => {
  assert.expect(4);
  let path = 'components-acceptance-tests/edit-form-validation/validation';

  // Open validation page.
  visit(path);

  andThen(() => {
    assert.equal(currentPath(), path);

    let $validationField = $($('.field.error')[1]);
    let $validationFlexberryTextbox = $validationField.children('.flexberry-textbox');
    let $validationFlexberryTextboxInner = $validationFlexberryTextbox.children('input');
    let $validationFlexberryErrorLable = $validationField.children('.label');

    // Check default validationmessage text.
    assert.equal($validationFlexberryErrorLable.text().trim(), 'Number is required,Number is invalid', 'Numeric textbox have default value');

    // Insert text in textbox.
    run(() => {
      $validationFlexberryTextboxInner[0].value = '2';
      $validationFlexberryTextboxInner.change();
    });

    // Check default validationmessage text for even numbers.
    assert.equal($validationFlexberryErrorLable.text().trim(), 'Number must be an odd', 'Numeric textbox have even value');

    // Insert text in textbox.
    run(() => {
      $validationFlexberryTextboxInner[0].value = '1';
      $validationFlexberryTextboxInner.change();
    });

    // Check default validationmessage text for odd numbers.
    assert.equal($validationFlexberryErrorLable.text().trim(), '', 'Numeric textbox have odd value');
  });
});
/* eslint-enable no-unused-vars */
