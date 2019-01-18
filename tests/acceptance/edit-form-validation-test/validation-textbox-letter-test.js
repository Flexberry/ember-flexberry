import { run } from '@ember/runloop';
import $ from 'jquery';
import { executeTest} from './execute-validation-test';

/* eslint-disable no-unused-vars */
executeTest('check operation letter textbox', (store, assert, app) => {
  assert.expect(4);
  let path = 'components-acceptance-tests/edit-form-validation/validation';

  // Open validation page.
  visit(path);

  andThen(() => {
    assert.equal(currentPath(), path);

    let $validationField = $($('.field.error')[2]);
    let $validationFlexberryTextbox = $validationField.children('.flexberry-textbox');
    let $validationFlexberryTextboxInner = $validationFlexberryTextbox.children('input');
    let $validationFlexberryErrorLable = $validationField.children('.label');

    // Check default validationmessage text.
    assert.equal($validationFlexberryErrorLable.text().trim(), 'Text is required,Text length must be >= 5', 'letter textbox have default value');

    // Insert text in textbox.
    run(() => {
      $validationFlexberryTextboxInner[0].value = '1';
      $validationFlexberryTextboxInner.change();
    });

    // Check default validationmessage for text length <5 letter.
    assert.equal($validationFlexberryErrorLable.text().trim(), 'Text length must be >= 5', 'letter textbox have < 5 letter');

    // Insert text in textbox.
    run(() => {
      $validationFlexberryTextboxInner[0].value = '12345';
      $validationFlexberryTextboxInner.change();
    });

    // Check default validationmessage for text length >5 letter.
    assert.equal($validationFlexberryErrorLable.text().trim(), '', 'letter textbox have >= 5 letter');
  });
});
/* eslint-enable no-unused-vars */
