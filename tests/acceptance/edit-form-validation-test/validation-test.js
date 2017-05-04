import Ember from 'ember';
import { executeTest} from './execute-validation-test';

executeTest('check complete all tests', (store, assert, app) => {
  assert.expect(2);
  let path = 'components-acceptance-tests/edit-form-validation/validation';

  // Open validation page.
  visit(path);

  andThen(() => {
    assert.equal(currentPath(), path);

    let $validationDataField = Ember.$('.calendar.link.icon');


    Ember.run(() => {
      // Open datepicker calendar.
      $validationDataField.click();
      let $validationDateButton = Ember.$('.available');
      $validationDateButton = Ember.$($validationDateButton[16]);

      // Select date.
      $validationDateButton.click();
    });

    let $validationFlexberryLookupButtons = Ember.$('.ui.button');
    let $validationFlexberryLookupButton = Ember.$($validationFlexberryLookupButtons[2]);

    // Click lookup button.
    Ember.run(() => {
      $validationFlexberryLookupButton.click();
    });

    let $validationFlexberryCheckboxs = Ember.$('.flexberry-checkbox');
    let $validationFlexberryCheckbox = Ember.$($validationFlexberryCheckboxs[0]);
    let $validationFlexberryOLVCheckbox = Ember.$($validationFlexberryCheckboxs[2]);


    Ember.run(() => {
      $validationFlexberryCheckbox.click();
      $validationFlexberryOLVCheckbox.click();
    });

    let $validationFlexberryDropdown = Ember.$('.flexberry-dropdown');

    Ember.run(() => {

      // Open dropdown.
      $validationFlexberryDropdown.click();
      let $validationFlexberryDropdownMenu = $validationFlexberryDropdown.children('.menu');
      let $validationFlexberryDropdownItems = $validationFlexberryDropdownMenu.children('.item');
      let $validationFlexberryDropdownItem = Ember.$($validationFlexberryDropdownItems[0]);

      // Select item
      $validationFlexberryDropdownItem.click();
    });

    let $validationFlexberryTextboxs = Ember.$('.flexberry-textbox');
    let $validationFlexberryTextbox1 = Ember.$($validationFlexberryTextboxs[0]);
    let $validationFlexberryTextbox2 = Ember.$($validationFlexberryTextboxs[1]);
    let $validationFlexberryOLVTextbox1 = Ember.$($validationFlexberryTextboxs[2]);
    let $validationFlexberryOLVTextbox2 = Ember.$($validationFlexberryTextboxs[3]);
    let $validationFlexberryTextarea = Ember.$('.flexberry-textarea');

    // Insert text in textbox and textarea.
    Ember.run(() => {
      $validationFlexberryTextbox1.text = "12311";
      $validationFlexberryTextbox2.text("Простой текст");
      $validationFlexberryOLVTextbox1.text("12311");
      $validationFlexberryOLVTextbox2.text("Простой текст");
      $validationFlexberryTextarea.text("Простой текст");
    });

    let done = assert.async();

    // Сounting the number of validationmessage.
    setTimeout(function() {
      let $validationLablesContainer = Ember.$('.ember-view.ui.basic.label');
      assert.equal($validationLablesContainer.length, 11, "All components have default value");
      done();
    }, 20000);
  });
});
