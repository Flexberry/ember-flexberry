import Ember from 'ember';
import { executeTest} from './execute-validation-test';

executeTest('check detail\'s components', (store, assert, app) => {
  assert.expect(3);
  let path = 'components-acceptance-tests/edit-form-validation/validation';

  // Open validation page.
  visit(path);
  andThen(() => {
    assert.equal(currentPath(), path);

    // Сounting the number of validationmessage.
    let $validationLablesContainer = Ember.$('.ember-view.ui.basic.label');
    assert.equal($validationLablesContainer.length, 11, 'All components have default value');

    let $validationFlexberryCheckboxs = Ember.$('.flexberry-checkbox');
    let $validationFlexberryOLVCheckbox = Ember.$($validationFlexberryCheckboxs[2]);

    let $validationFlexberryTextboxs = Ember.$('.flexberry-textbox');
    let $validationFlexberryOLVTextbox1 = Ember.$($validationFlexberryTextboxs[2]);
    let $validationFlexberryOLVTextbox2 = Ember.$($validationFlexberryTextboxs[3]);

    // Selct textbox inner.
    let $validationFlexberryTextboxInner1 = $validationFlexberryOLVTextbox1.children('input');
    let $validationFlexberryTextboxInner2 = $validationFlexberryOLVTextbox2.children('input');

    // Select deteil's validationmessages.
    let $validationField1 = Ember.$($validationLablesContainer[8]);
    let $validationField2 = Ember.$($validationLablesContainer[9]);
    let $validationField3 = Ember.$($validationLablesContainer[10]);

    // Data insertion.
    Ember.run(() => {
      $validationFlexberryOLVCheckbox.click();
      $validationFlexberryTextboxInner1[0].value = '1';
      $validationFlexberryTextboxInner1.change();
      $validationFlexberryTextboxInner2[0].value = '12345';
      $validationFlexberryTextboxInner2.change();
    });

    // Validationmessage must be empty.
    assert.ok(
      $validationField1.text().trim() === '' &&
      $validationField2.text().trim() === '' &&
      $validationField3.text().trim() === '',
      'All components have default value');
  });
});
