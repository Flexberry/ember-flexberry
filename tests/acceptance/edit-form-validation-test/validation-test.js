import Ember from 'ember';
import { executeTest} from './execute-validation-test';

executeTest('check complete all tests', (store, assert, app) => {
  assert.expect(3);
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

      // Select date.
      Ember.$($validationDateButton[15]).click();
      Ember.$($validationDateButton[16]).click();
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

    let $validationFlexberryTextboxInner1 = $validationFlexberryTextbox1.children('input');
    let $validationFlexberryTextboxInner2 = $validationFlexberryTextbox2.children('input');
    let $validationFlexberryOLVTextboxInner1 = $validationFlexberryOLVTextbox1.children('input');
    let $validationFlexberryOLVTextboxInner2 = $validationFlexberryOLVTextbox2.children('input');
    let $validationFlexberryTextAreaInner = $validationFlexberryTextarea.children('textarea');

    // Insert text in textbox and textarea.
    Ember.run(() => {
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

    let $validationFlexberryFileAddButton = Ember.$('.add.outline');

    Ember.run(() => {
      $validationFlexberryFileAddButton.click();
    });

    let done = assert.async();

    // Сounting the number of validationmessage.
    setTimeout(function() {
      let $validationLablesContainer = Ember.$('.ember-view.ui.basic.label');
      let $validationMessage = true;

      for (let i = 0; i < 10; i++) {
        if ($validationLablesContainer[i].textContent.trim() !== '')
        {
          $validationMessage = false;
        }
      }

      let $validationSixteenWide = Ember.$('.list');
      let $validationLi = $validationSixteenWide.children('li');

      // Сounting the number of validationmessage.
      assert.equal($validationLi.length, 0, 'All components have default value in sixteenWide');

      assert.ok($validationMessage, 'All components have correct value, All validationmessage disabled');
      done();
    }, 5000);
  });
});
