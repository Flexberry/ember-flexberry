import { run } from '@ember/runloop';
import $ from 'jquery';
import { executeTest } from './execute-validation-test';

/* eslint-disable no-unused-vars */
executeTest('check operation lookup', async (store, assert, app) => {
  assert.expect(3);
  let path = 'components-acceptance-tests/edit-form-validation/validation';

  // Open validation page.
  await visit(path);

  assert.equal(currentPath(), path);

  let $validationField = $($('.field')[8]);
  let $validationFlexberryErrorLable = $validationField.children('.label');

  // Check default validationmessage text.
  assert.equal($validationFlexberryErrorLable.text().trim(), 'Master is required', 'Lookup have default value');

  let $validationFlexberryLookupButton = $('.ui.button.ui-change')[0];

  // Click lookup button.
  run(async () => {
    await click($validationFlexberryLookupButton);
  });

  // Waiting for the action complete.
  await new Promise(resolve => setTimeout(resolve, 1000));
  assert.equal($validationFlexberryErrorLable.text().trim(), '', 'Lookup have value');
});
/* eslint-enable no-unused-vars */
