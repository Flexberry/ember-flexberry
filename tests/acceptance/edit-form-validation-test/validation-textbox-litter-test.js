import Ember from 'ember';
import { executeTest} from './execute-validation-test';

executeTest('check operation litter textbox', (store, assert, app) => {
  assert.expect(4);
  let path = 'components-acceptance-tests/edit-form-validation/validation';

  visit(path);
  andThen(() => {
    assert.equal(currentPath(), path);

    let $validationFieldNumericTextbox = Ember.$(Ember.$('.field.error')[2]);
    let $validationFlexberryTextbox = $validationFieldNumericTextbox.children('.flexberry-textbox');
    let $validationFlexberryErrorLable = $validationFieldNumericTextbox.children('.label');

    assert.equal($validationFlexberryErrorLable.text().trim(), "Text is required,Text length must be >= 5", "Litter textbox have default value");

    Ember.run(() => {
      $validationFlexberryTextbox.text("1");
    });

    assert.equal($validationFlexberryErrorLable.text().trim(), "Text length must be >= 5", "Litter textbox have < 5 litter");

    Ember.run(() => {
      $validationFlexberryTextbox.text("123456");
    });

    assert.equal($validationFlexberryErrorLable.text().trim(), "", "Litter textbox have > 5 litter");
  });
});
