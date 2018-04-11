import { run } from '@ember/runloop';
import $ from 'jquery';
import { executeTest} from './execute-validation-test';

/* eslint-disable no-unused-vars */
executeTest('check operation datepicker', (store, assert, app) => {
  assert.expect(3);
  let path = 'components-acceptance-tests/edit-form-validation/validation';

  // Open validation page.
  visit(path);

  andThen(() => {
    assert.equal(currentPath(), path);

    let $validationField = $($('.field.error')[4]);
    $validationField = $validationField.children('.inline');
    let $validationFlexberryErrorLable = $validationField.children('.label');
    let $validationDateField = $('.calendar.link.icon');

    // Check default validationmessage text.
    assert.equal($validationFlexberryErrorLable.text().trim(), 'Date is required', 'Datepicker have default value');

    run(() => {

      // Open datepicker calendar.
      $validationDateField.click();
      let $validationDateButton = $('.available:not(.active)');
      $validationDateButton = $($validationDateButton[18]);

      // Select date.
      $validationDateButton.click();
    });

    // Check validationmessage text.
    $validationFlexberryErrorLable = $validationField.children('.label');

    // Waiting for completion _setProperOffsetToCalendar().
    let done = assert.async();
    setTimeout(function() {
      assert.equal($validationFlexberryErrorLable.text().trim(), '', 'Datepicker have value');
      done();
    }, 2000);
  });
});
/* eslint-enable no-unused-vars */
