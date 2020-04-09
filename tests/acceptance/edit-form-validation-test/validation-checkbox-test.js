import { run } from '@ember/runloop';
import $ from 'jquery';
import { executeTest} from './execute-validation-test';

/* eslint-disable no-unused-vars */
executeTest('check operation checkbox', (store, assert, app) => {
  assert.expect(4);
  let path = 'components-acceptance-tests/edit-form-validation/validation';

  // Open validation page.
  visit(path);

  andThen(() => {
    assert.equal(currentPath(), path);

    let $validationField = $($('.field.error')[0]);
    let $validationFlexberryCheckbox = $validationField.children('.flexberry-checkbox');
    let $validationFlexberryErrorLable = $validationField.children('.label');

    // Check default validationmessage text.
    assert.equal(
      $validationFlexberryErrorLable.text().trim(),
      'Flag is required,Flag must be \'true\' only',
      'Checkbox\'s label have default value by default');

    run(() => {
      $validationFlexberryCheckbox.click();
    });

    // Check validationmessage text afther first click.
    assert.equal(
      $validationFlexberryErrorLable.text().trim(),
      '',
      'Checkbox\'s label havn\'t value after first click');

    run(() => {
      $validationFlexberryCheckbox.click();
    });

    // Check validationmessage text = 'Flag must be 'true' only' afther first click.
    assert.equal(
      $validationFlexberryErrorLable.text().trim(),
      'Flag must be \'true\' only',
      'Checkbox\'s label have value after second click');
  });
});
/* eslint-enable no-unused-vars */
