import Ember from 'ember';
import { executeTest} from './execute-validation-test';

executeTest('check operation dropdown', (store, assert, app) => {
  assert.expect(3);
  let path = 'components-acceptance-tests/edit-form-validation/validation';

  // Open validation page.
  visit(path);

  andThen(() => {
    assert.equal(currentPath(), path);

    let $validationField = Ember.$(Ember.$('.field.error')[5]);
    let $validationFlexberryDropdown = $validationField.children('.flexberry-dropdown');
    let $validationFlexberryErrorLable = $validationField.children('.label');

    // Check default validationmessage text.
    assert.equal($validationFlexberryErrorLable.text().trim(), 'Enumeration is required', 'Dropdown have default value');

    Ember.run(() => {

      // Open dropdown.
      $validationFlexberryDropdown.click();
      let $validationFlexberryDropdownMenu = $validationFlexberryDropdown.children('.menu');
      let $validationFlexberryDropdownItems = $validationFlexberryDropdownMenu.children('.item');
      let $validationFlexberryDropdownItem = Ember.$($validationFlexberryDropdownItems[0]);

      // Select item
      $validationFlexberryDropdownItem.click();
    });

    // Validationmessage must be empty.
    assert.equal($validationFlexberryErrorLable.text().trim(), '', 'Dropdown have value');
  });
});
