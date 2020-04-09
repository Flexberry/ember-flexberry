import { run } from '@ember/runloop';
import $ from 'jquery';
import {executeTest} from './execute-validation-test';

/* eslint-disable no-unused-vars */
executeTest('check operation file', (store, assert, app) => {
  assert.expect(3);
  let path = 'components-acceptance-tests/edit-form-validation/validation';

  visit(path);
  andThen(() => {
    assert.equal(currentPath(), path);

    let $validationFieldFile = $($('.field.error')[6]);
    let $validationFlexberryErrorLable = $validationFieldFile.children('.label');

    // Check default validationmessage text.
    assert.equal($validationFlexberryErrorLable.text().trim(), 'File is required', 'Flexberry file have default value');

    let $validationFlexberryLookup = $('.flexberry-lookup');
    let $validationFlexberryLookupInput = $validationFlexberryLookup.children('.input');
    let $validationFlexberryLookupButton = $validationFlexberryLookupInput.children('.ui-change.button');


    // Click lookup button.
    run(() => {
      $validationFlexberryLookupButton.click();
    });

    let done = assert.async();

    // Сounting the number of validationmessage.
    setTimeout(function() {
      assert.equal($validationFlexberryErrorLable.text().trim(), '', 'Flexberry file have value');
      done();
    }, 2000);
  });
});
/* eslint-enable no-unused-vars */
