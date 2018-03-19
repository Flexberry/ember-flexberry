import Ember from 'ember';
import { executeTest} from './execute-validation-test';

executeTest('check operation datepicker', (store, assert, app) => {
  assert.expect(3);
  let path = 'components-acceptance-tests/edit-form-validation/validation';

  // Open validation page.
  visit(path);

  andThen(() => {
    assert.equal(currentPath(), path);

    let $validationField = Ember.$(Ember.$('.field.error')[4]);
    $validationField = $validationField.children('.inline');
    let $validationFlexberryErrorLable = $validationField.children('.label');
    let $validationDateField = Ember.$('.calendar.link.icon');

    // Check default validationmessage text.
    assert.equal($validationFlexberryErrorLable.text().trim(), 'Date is required', 'Datepicker have default value');

    Ember.run(() => {

      // Open datepicker calendar.
      $validationDateField.click();
      let $validationDateButton = Ember.$('.available:not(.active)');
      $validationDateButton = Ember.$($validationDateButton[18]);

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
