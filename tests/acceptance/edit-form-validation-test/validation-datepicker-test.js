import Ember from 'ember';
import { executeTest} from './execute-validation-test';

executeTest('check operation datepicker', (store, assert, app) => {
  assert.expect(2);
  let path = 'components-acceptance-tests/edit-form-validation/validation';

  // Open validation page.
  visit(path);

  andThen(() => {
    assert.equal(currentPath(), path);

    let $validationField = Ember.$(Ember.$('.field.error')[4]);
    $validationField = $validationField.children('.inline');
    let $validationFlexberryErrorLable = $validationField.children('.label');
    let $validationDataField = Ember.$('.calendar.link.icon');

    // Check default validationmessage text.
    assert.equal($validationFlexberryErrorLable.text().trim(), "Date is required", "Datepicker have default value");

    Ember.run(() => {

      // Open datepicker calendar.
      $validationDataField.click();
      let $validationDateButton = Ember.$('.available');
      $validationDateButton = Ember.$($validationDateButton[16]);

      // Select date.
      $validationDateButton.click();
    });

    // Check validationmessage text.
    $validationFlexberryErrorLable = $validationField.children('.label');
  });
});
