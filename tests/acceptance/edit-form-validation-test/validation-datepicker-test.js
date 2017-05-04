import Ember from 'ember';
import { executeTest} from './execute-validation-test';

executeTest('check operation datepicker', (store, assert, app) => {
  assert.expect(3);
  let path = 'components-acceptance-tests/edit-form-validation/validation';

  visit(path);
  andThen(() => {
    assert.equal(currentPath(), path);

    let $validationFieldNumericTextbox = Ember.$(Ember.$('.field.error')[4]);
    $validationFieldNumericTextbox = $validationFieldNumericTextbox.children('.inline');
    let $validationFlexberryErrorLable = $validationFieldNumericTextbox.children('.label');
    let $validationDataField = Ember.$('.calendar.link.icon');

    assert.equal($validationFlexberryErrorLable.text().trim(), "Date is required", "Datepicker have default value");

    Ember.run(() => {
      $validationDataField.click();
      let $validationDateButton = Ember.$('.available');
      $validationDateButton = Ember.$($validationDateButton[16]);
      $validationDateButton.click();
    });

    let done = assert.async();

    setTimeout(function() {
      assert.equal($validationFlexberryErrorLable.text().trim(), "", "Datepicker have value");
      done();
    }, 500);
  });
});
