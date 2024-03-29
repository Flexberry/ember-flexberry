import { run } from '@ember/runloop';
import $ from 'jquery';
import { executeTest} from './execute-validation-test';

/* eslint-disable no-unused-vars */
executeTest('check operation lookup', (store, assert, app) => {
  assert.expect(3);
  let path = 'components-acceptance-tests/edit-form-validation/validation';

  // Open validation page.
  visit(path);

  andThen(() => {
    assert.equal(currentPath(), path);

    let $validationField = $($('.field')[8]);
    let $validationFlexberryErrorLable = $validationField.children('.label');

    // Check default validationmessage text.
    assert.equal($validationFlexberryErrorLable.text().trim(), 'Master is required', 'Lookup have default value');

    let $validationFlexberryLookupButton = $('.ui.button.ui-change')[0];

    // Click lookup button.
    run(() => {
      $validationFlexberryLookupButton.click();
    });

    let done = assert.async();

    // Waiting for the action complete.
    setTimeout(function() {
      assert.equal($validationFlexberryErrorLable.text().trim(), '', 'Lookup have value');
      done();
    }, 1000);
  });
});
/* eslint-enable no-unused-vars */
