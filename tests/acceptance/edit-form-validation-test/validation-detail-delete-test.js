import Ember from 'ember';
import { executeTest} from './execute-validation-test';

executeTest('check detail delete', (store, assert, app) => {
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
    let $validationFlexberryCheckbox = Ember.$($validationFlexberryCheckboxs[1]);
    let $validationFlexberryOLVDeleteButton = Ember.$(Ember.$('.ui.disabled.button')[1]);

    // Delete detail.
    Ember.run($validationFlexberryCheckbox, $validationFlexberryCheckbox.click);
    Ember.run($validationFlexberryOLVDeleteButton, $validationFlexberryOLVDeleteButton.click);

    // Сounting the number of validationmessage = 8 afther detail delete.
    $validationLablesContainer = Ember.$('.ember-view.ui.basic.label');
    assert.equal($validationLablesContainer.length, 8, 'Detail was deleted without errors');
  });
});
