import Ember from 'ember';
import { executeTest} from './execute-validation-test';

executeTest('check operation numeric textbox', (store, assert, app) => {
  assert.expect(4);
  let path = 'components-acceptance-tests/edit-form-validation/validation';

  visit(path);
  andThen(() => {
    assert.equal(currentPath(), path);

    let $validationFieldNumericTextbox = Ember.$(Ember.$('.field.error')[2]);
    let $validationFlexberryTextbox = $validationFieldNumericTextbox.children('.flexberry-textbox');
    let $validationFlexberryErrorLable = $validationFieldNumericTextbox.children('.label');

    assert.equal($validationFlexberryErrorLable.text().trim(), "Number is required,Number is invalid", "Numeric textbox have default value");

    Ember.run(() => {
      $validationFlexberryTextbox.text("2");
    });

    assert.equal($validationFlexberryErrorLable.text().trim(), "Number is invalid", "Numeric textbox have even value");

    Ember.run(() => {
      $validationFlexberryTextbox.text("1");
    });

    assert.equal($validationFlexberryErrorLable.text().trim(), "", "Numeric textbox have odd value");
  });
});
