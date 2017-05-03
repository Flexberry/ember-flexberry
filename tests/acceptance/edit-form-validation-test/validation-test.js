import Ember from 'ember';
import { executeTest} from './execute-validation-test';

executeTest('check complete all tests', (store, assert, app) => {
  assert.expect(2);
  let path = 'components-acceptance-tests/edit-form-validation/validation';

  visit(path);
  andThen(() => {
    assert.equal(currentPath(), path);

    let $validationDataField = Ember.$('.calendar.link.icon');

    Ember.run(() => {
      $validationDataField.click();
      let $validationDate = $validationDataField.children('.menu');

      let $validationDateButton = Ember.$('.available');
      $validationDateButton = Ember.$($validationDateButton[16]);
      $validationDateButton.click();
    });

    let $validationFlexberryLookupButtons = Ember.$('.ui.button');
    let $validationFlexberryLookupButton = Ember.$($validationFlexberryLookupButtons[2]);

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
      $validationFlexberryDropdown.click();
      let $validationFlexberryDropdownMenu = $validationFlexberryDropdown.children('.menu');
      let $validationFlexberryDropdownItems = $validationFlexberryDropdownMenu.children('.item');
      let $validationFlexberryDropdownItem = Ember.$($validationFlexberryDropdownItems[0]);
      $validationFlexberryDropdownItem.click();
    });

    let $validationFlexberryTextboxs = Ember.$('.flexberry-textbox');
    let $validationFlexberryTextbox1 = Ember.$($validationFlexberryTextboxs[0]);
    let $validationFlexberryTextbox2 = Ember.$($validationFlexberryTextboxs[1]);
    let $validationFlexberryOLVTextbox1 = Ember.$($validationFlexberryTextboxs[2]);
    let $validationFlexberryOLVTextbox2 = Ember.$($validationFlexberryTextboxs[3]);
    let $validationFlexberryTextarea = Ember.$('.flexberry-textarea');

    Ember.run(() => {
      $validationFlexberryTextbox1.text = "12311";
      $validationFlexberryTextbox2.text("Простой текст");
      $validationFlexberryOLVTextbox1.text("12311");
      $validationFlexberryOLVTextbox2.text("Простой текст");
      $validationFlexberryTextarea.text("Простой текст");
    });

    /*let $validationFlexberryFile = Ember.$('.flexberry-file');

    Ember.run(() => {
      let tempFile = { fileName: 'Ждём НГ.png', fileSize: '27348', fileMimeType: '27348'};
      $validationFlexberryFile.value = tempFile;
    });

    let done = assert.async();

    setTimeout(function() {

      let $validationLablesContainer = Ember.$('.ember-view.ui.basic.label');
      assert.equal($validationLablesContainer.length, 11, "All components have default value");
      done();
    }, 20000);*/
  });
});