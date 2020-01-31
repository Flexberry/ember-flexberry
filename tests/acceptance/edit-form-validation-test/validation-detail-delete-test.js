import { run } from '@ember/runloop';
import $ from 'jquery';
import { executeTest} from './execute-validation-test';

/* eslint-disable no-unused-vars */
executeTest('check detail delete', (store, assert, app) => {
  assert.expect(3);
  let path = 'components-acceptance-tests/edit-form-validation/validation';

  // Open validation page.
  visit(path);

  andThen(() => {
    assert.equal(currentPath(), path);

    // Сounting the number of validationmessage.
    let $validationLablesContainer = $('.ember-view.ui.basic.label');
    assert.equal($validationLablesContainer.length, 11, 'All components have default value');

    let $validationFlexberryCheckboxs = $('.flexberry-checkbox');
    let $validationFlexberryCheckbox = $($validationFlexberryCheckboxs[1]);
    let $validationFlexberryOLVDeleteButton = $($('.ui.disabled.button')[1]);

    // Delete detail.
    Ember.run($validationFlexberryCheckbox, $validationFlexberryCheckbox.click);
    Ember.run($validationFlexberryOLVDeleteButton, $validationFlexberryOLVDeleteButton.click);

    // Сounting the number of validationmessage = 8 afther detail delete.
    $validationLablesContainer = $('.ember-view.ui.basic.label');
    assert.equal($validationLablesContainer.length, 8, 'Detail was deleted without errors');
  });
});
/* eslint-enable no-unused-vars */
