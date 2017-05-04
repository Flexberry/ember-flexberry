import Ember from 'ember';
import { executeTest} from './execute-validation-test';

executeTest('check operation numeric textbox', (store, assert, app) => {
  assert.expect(4);
  let path = 'components-acceptance-tests/edit-form-validation/validation';

  visit(path);
  andThen(() => {
    assert.equal(currentPath(), path);

    let $validationField = Ember.$(Ember.$('.field.error')[1]);
    let $validationFlexberryTextbox = $validationField.children('.flexberry-textbox');
    let $validationFlexberryTextboxInner= $validationFlexberryTextbox.children('input');
    let $validationFlexberryErrorLable = $validationField.children('.label');

    assert.equal($validationFlexberryErrorLable.text().trim(), "Number is required,Number is invalid", "Numeric textbox have default value");

    Ember.run(() => {
      $validationFlexberryTextboxInner[0].value = "2";
      $validationFlexberryTextboxInner.change();
    });

    assert.equal($validationFlexberryErrorLable.text().trim(), "Number must be an odd", "Numeric textbox have even value");

    Ember.run(() => {
      $validationFlexberryTextboxInner[0].value = "1";
      $validationFlexberryTextboxInner.change();
    });

    assert.equal($validationFlexberryErrorLable.text().trim(), "", "Numeric textbox have odd value");
  });
});
