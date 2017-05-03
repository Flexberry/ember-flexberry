import Ember from 'ember';
import { executeTest} from './execute-validation-test';

executeTest('check detail\'s components', (store, assert, app) => {
  assert.expect(3);
  let path = 'components-acceptance-tests/edit-form-validation/validation';

  visit(path);
  andThen(() => {
    assert.equal(currentPath(), path);

    let $validationLablesContainer = Ember.$('.ember-view.ui.basic.label');
    assert.equal($validationLablesContainer.length, 11, "All components have default value");

    let $validationFlexberryCheckboxs = Ember.$('.flexberry-checkbox');
    let $validationFlexberryOLVCheckbox = Ember.$($validationFlexberryCheckboxs[2]);

    let $validationFlexberryTextboxs = Ember.$('.flexberry-textbox');
    let $validationFlexberryOLVTextbox1 = Ember.$($validationFlexberryTextboxs[2]);
    let $validationFlexberryOLVTextbox2 = Ember.$($validationFlexberryTextboxs[3]);

    Ember.run(() => {
      $validationFlexberryOLVCheckbox.click();
      $validationFlexberryOLVTextbox1.text("12311");
      $validationFlexberryOLVTextbox2.text("Простой текст");
    });

    let done = assert.async();

    setTimeout(function() {
      $validationLablesContainer = Ember.$('.ember-view.ui.basic.label');
      assert.equal($validationLablesContainer.length, 9, "Detail have curently value");
      done();
    }, 2000);
  });
});
