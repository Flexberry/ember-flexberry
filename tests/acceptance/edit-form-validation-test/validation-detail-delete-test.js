import Ember from 'ember';
import { executeTest} from './execute-validation-test';

executeTest('check detail delete', (store, assert, app) => {
  assert.expect(3);
  let path = 'components-acceptance-tests/edit-form-validation/validation';

  visit(path);
  andThen(() => {
    assert.equal(currentPath(), path);

    let $validationLablesContainer = Ember.$('.ember-view.ui.basic.label');
    assert.equal($validationLablesContainer.length, 11, "All components have default value");

    let $validationFlexberryCheckboxs = Ember.$('.flexberry-checkbox');
    let $validationFlexberryCheckbox = Ember.$($validationFlexberryCheckboxs[1]);
    let $validationFlexberryOLVDeleteButton = Ember.$(Ember.$('.ui.disabled.button')[1]);

    Ember.run(() => {
      $validationFlexberryCheckbox.click();
      $validationFlexberryOLVDeleteButton.click();
    });

    $validationLablesContainer = Ember.$('.ember-view.ui.basic.label');
    assert.equal($validationLablesContainer.length, 8, "Detail was deleted without errors");
  });
});
