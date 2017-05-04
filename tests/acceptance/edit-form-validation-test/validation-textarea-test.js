import Ember from 'ember';
import { executeTest} from './execute-validation-test';

executeTest('check operation textarea', (store, assert, app) => {
  assert.expect(3);
  let path = 'components-acceptance-tests/edit-form-validation/validation';

  visit(path);
  andThen(() => {
    assert.equal(currentPath(), path);

    let $validationFieldNumericTextbox = Ember.$(Ember.$('.field.error')[3]);
    let $validationFlexberryTextarea = Ember.$('.flexberry-textarea');
    let $validationFlexberryTextboxInner= $validationFlexberryTextarea.children('textarea');
    let $validationFlexberryErrorLable = $validationFieldNumericTextbox.children('.label');

    assert.equal($validationFlexberryErrorLable.text().trim(), "Long text is required", "Textarea have default value");

    Ember.run(() => {
      $validationFlexberryTextboxInner.val("1");
      $validationFlexberryTextboxInner.change();
    });

    assert.equal($validationFlexberryErrorLable.text().trim(), "", "Textarea have default value");
  });
});
