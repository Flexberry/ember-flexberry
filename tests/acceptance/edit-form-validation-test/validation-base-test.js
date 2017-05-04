import Ember from 'ember';
import { executeTest} from './execute-validation-test';

executeTest('check default value', (store, assert, app) => {
  assert.expect(2);
  let path = 'components-acceptance-tests/edit-form-validation/validation';
  
  // Open validation page.
  visit(path);

  andThen(() => {
    assert.equal(currentPath(), path);

    let $validationLablesContainer = Ember.$('.ember-view.ui.basic.label');

    // Сounting the number of validationmessage.
    assert.equal($validationLablesContainer.length, 11, 'All components have default value');
  });
});
