import Ember from 'ember';
import { executeTest} from './execute-validation-test';

executeTest('check operation litter textbox', (store, assert, app) => {
  assert.expect(4);
  let path = 'components-acceptance-tests/edit-form-validation/validation';

  visit(path);
  andThen(() => {
    assert.equal(currentPath(), path);

    let $validationFieldLiterTextbox = Ember.$(Ember.$('.field.error')[2]);
    let $validationFlexberryTextbox = $validationFieldLiterTextbox.children('.flexberry-textbox');
    let $validationFlexberryTextboxInner= $validationFlexberryTextbox.children('input');
    let $validationFlexberryErrorLable = $validationFieldLiterTextbox.children('.label');

    assert.equal($validationFlexberryErrorLable.text().trim(), "Text is required,Text length must be >= 5", "Litter textbox have default value");

    Ember.run(() => {
      $validationFlexberryTextboxInner[0].value = "1";
      $validationFlexberryTextboxInner.change();
    });

    assert.equal($validationFlexberryErrorLable.text().trim(), "Text length must be >= 5", "Litter textbox have < 5 litter");

    Ember.run(() => {
      $validationFlexberryTextboxInner[0].value = "12345";
      $validationFlexberryTextboxInner.change();
    });

    assert.equal($validationFlexberryErrorLable.text().trim(), "", "Litter textbox have >= 5 litter");
  });
});
