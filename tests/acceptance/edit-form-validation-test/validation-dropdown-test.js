import Ember from 'ember';
import { executeTest} from './execute-validation-test';

executeTest('check operation dropdown', (store, assert, app) => {
  assert.expect(3);
  let path = 'components-acceptance-tests/edit-form-validation/validation';

  visit(path);
  andThen(() => {
    assert.equal(currentPath(), path);

    let $validationFieldNumericTextbox = Ember.$(Ember.$('.field.error')[5]);
    let $validationFlexberryDropdown = $validationFieldNumericTextbox.children('.flexberry-dropdown');
    let $validationFlexberryErrorLable = $validationFieldNumericTextbox.children('.label');

    assert.equal($validationFlexberryErrorLable.text().trim(), "Enumeration is required", "Dropdown have default value");

    Ember.run(() => {
      $validationFlexberryDropdown.click();
      let $validationFlexberryDropdownMenu = $validationFlexberryDropdown.children('.menu');
      let $validationFlexberryDropdownItems = $validationFlexberryDropdownMenu.children('.item');
      let $validationFlexberryDropdownItem = Ember.$($validationFlexberryDropdownItems[0]);
      $validationFlexberryDropdownItem.click();
    });

    assert.equal($validationFlexberryErrorLable.text().trim(), "", "Dropdown have value");
  });
});
