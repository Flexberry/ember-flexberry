import Ember from 'ember';
import { executeTest} from './execute-validation-test';

executeTest('check operation lookup', (store, assert, app) => {
  assert.expect(3);
  let path = 'components-acceptance-tests/edit-form-validation/validation';

  visit(path);
  andThen(() => {
    assert.equal(currentPath(), path);

    let $validationFieldNumericTextbox = Ember.$(Ember.$('.field.error')[7]);
    let $validationFlexberryErrorLable = $validationFieldNumericTextbox.children('.label');

    assert.equal($validationFlexberryErrorLable.text().trim(), "Master is required", "Lookup have default value");

    let $validationFlexberryLookupButtons = Ember.$('.ui.button');
    let $validationFlexberryLookupButton = Ember.$($validationFlexberryLookupButtons[2]);

    Ember.run(() => {
      $validationFlexberryLookupButton.click();
    });

    let done = assert.async();

    setTimeout(function() {
      let $validationLablesContainer = Ember.$('.ember-view.ui.basic.label');

      assert.equal($validationFlexberryErrorLable.text().trim(), "", "Lookup have value");

      done();
    }, 1000);
  });
});
