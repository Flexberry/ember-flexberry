import Ember from 'ember';
import {executeTest} from './execute-validation-test';

executeTest('check operation file', (store, assert, app) => {
  assert.expect(3);
  let path = 'components-acceptance-tests/edit-form-validation/validation';

  visit(path);
  andThen(() => {
    assert.equal(currentPath(), path);

    let $validationFieldFile = Ember.$(Ember.$('.field.error')[6]);
    let $validationFlexberryErrorLable = $validationFieldFile.children('.label');

    // Check default validationmessage text.
    assert.equal($validationFlexberryErrorLable.text().trim(), 'File is required', 'Flexberry file have default value');

    let $validationFlexberryLookupButton = Ember.$('.ui.button.ui-change')[0];

    // Click lookup button.
    Ember.run(() => {
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
