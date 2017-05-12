import Ember from 'ember';
import { executeTest} from './execute-validation-test';
//import startApp from '../../helpers/start-app';

executeTest('check operation file', (store, assert, app) => {
  assert.expect(2);
  let path = 'components-acceptance-tests/edit-form-validation/validation';

  visit(path);
  andThen(() => {
    //let tempFile = { fileName: 'Ждём НГ.png', fileSize: '27348', fileMimeType: '27348' };

    // let app = startApp();
    // let applicationController = app.__container__.lookup('controller:' + path);
    // applicationController.set('isInAcceptanceTestMode', true);

    //applicationController.model.set('file', tempFile);

    assert.equal(currentPath(), path);

    let $validationFieldFile = Ember.$(Ember.$('.field.error')[6]);
    let $validationFlexberryErrorLable = $validationFieldFile.children('.label');

    assert.equal($validationFlexberryErrorLable.text().trim(), 'File is required', 'Flexberry file have default value');

    let $validationFlexberryFileAddButton = Ember.$('.add.outline');

    Ember.run(() => {
      $validationFlexberryFileAddButton.click();
    });

    // assert.equal($validationFlexberryErrorLable.text().trim(), '', 'Flexberry file have value');
  });
});
