import Ember from 'ember';
import { executeTest} from './execute-validation-test';

executeTest('check operation checkbox', (store, assert, app) => {
  assert.expect(4);
  let path = 'components-acceptance-tests/edit-form-validation/validation';

  visit(path);
  andThen(() => {
    assert.equal(currentPath(), path);

    let $validationFieldCheckbox = Ember.$(Ember.$('.field.error')[0]);
    let $validationFlexberryCheckbox = $validationFieldCheckbox.children('.flexberry-checkbox');
    let $validationFlexberryErrorLable = $validationFieldCheckbox.children('.label');

    assert.equal($validationFlexberryErrorLable.text().trim(), "Flag is required,Flag must be 'true' only", "Checkbox's label have default value by default");

    Ember.run(() => {
      $validationFlexberryCheckbox.click();
    });

    assert.equal($validationFlexberryErrorLable.text().trim(), "", "Checkbox's label havn't value after first click");

    Ember.run(() => {
      $validationFlexberryCheckbox.click();
    });

    assert.equal($validationFlexberryErrorLable.text().trim(), "Flag must be 'true' only", "Checkbox's label have value after second click");
  });
});
