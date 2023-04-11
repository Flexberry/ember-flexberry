import { run } from '@ember/runloop';
import $ from 'jquery';
import { executeTest} from './execute-validation-test';

/* eslint-disable no-unused-vars */
executeTest('check operation textarea', (store, assert, app) => {
  assert.expect(3);
  let path = 'components-acceptance-tests/edit-form-validation/validation';

  // Open validation page.
  visit(path);

  andThen(() => {
    assert.equal(currentPath(), path);

    let $validationField = $($('.field')[4]);
    let $validationFlexberryTextarea = $('.flexberry-textarea');
    let $validationFlexberryTextboxInner = $validationFlexberryTextarea.children('textarea');
    let $validationFlexberryErrorLable = $validationField.children('.label');

    // Check default validationmessage text.
    assert.equal($validationFlexberryErrorLable.text().trim(), 'Long text is required', 'Textarea have default value');

    // Insert text in textarea.
    run(() => {
      $validationFlexberryTextboxInner.val('1');
      $validationFlexberryTextboxInner.change();
    });

    // Validationmessage must be empty.
    assert.equal($validationFlexberryErrorLable.text().trim(), '', 'Textarea have default value');
  });
});
/* eslint-enable no-unused-vars */
