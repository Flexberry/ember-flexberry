import Ember from 'ember';
import { executeTest} from './execute-validation-test';

executeTest('check operation file', (store, assert, app) => {
  assert.expect(3);
  let path = 'components-acceptance-tests/edit-form-validation/validation';

  visit(path);
  andThen(() => {
    assert.equal(currentPath(), path);

    let $validationFieldFile = Ember.$(Ember.$('.field.error')[6]);
    let $validationFlexberryErrorLable = $validationFieldFile.children('.label');

    assert.equal($validationFlexberryErrorLable.text().trim(), "File is required", "Flexberry file have default value");

    let $validationFlexberryFile = Ember.$('.flexberry-file');

    /*Ember.run(() => {
      let tempFile = { fileName: 'Ждём НГ.png', fileSize: '27348', fileMimeType: '27348'};
      $validationFlexberryFile[0].value = tempFile;
    });*/


    let done = assert.async();

    setTimeout(function() {
      assert.equal($validationFlexberryErrorLable.text().trim(), "", "Flexberry file have value");
      $validationFlexberryFile = Ember.$('.flexberry-file');
      done();
    }, 30000);
  });
});
