import Ember from 'ember';
import { executeTest} from './execute-validation-test';

executeTest('check operation file', (store, assert, app) => {
  assert.expect(3);
  let path = 'components-acceptance-tests/edit-form-validation/validation';

  visit(path);
  andThen(() => {
    assert.equal(currentPath(), path);

    let $validationFieldNumericTextbox = Ember.$(Ember.$('.field.error')[6]);
    let $validationFlexberryErrorLable = $validationFieldNumericTextbox.children('.label');

    assert.equal($validationFlexberryErrorLable.text().trim(), "Master is required", "Lookup have default value");

    /*let $validationFlexberryFile = Ember.$('.flexberry-file');

    Ember.run(() => {
      let tempFile = { fileName: 'Ждём НГ.png', fileSize: '27348', fileMimeType: '27348'};
      $validationFlexberryFile.value = tempFile;
    });*/


    let done = assert.async();

    setTimeout(function() {
      assert.equal($validationFlexberryErrorLable.text().trim(), "", "Lookup have value");
      done();
    }, 1000);
  });
});
