import $ from 'jquery';
import { executeTest} from './execute-validation-test';

/* eslint-disable no-unused-vars */
executeTest('check detail delete', (store, assert, app) => {
  assert.expect(3);
  let path = 'components-acceptance-tests/edit-form-validation/validation';

  // Open validation page.
  visit(path);

  andThen(() => {
    assert.equal(currentPath(), path);

    // Сounting the number of validationmessage.
    let $validationLablesContainer = $('.ember-view.ui.basic.label');
    assert.equal($validationLablesContainer.length, 11, 'All components have default value');

    // Delete detail.
    click('.groupedit-new-row .flexberry-checkbox:first');
    click('.groupedit-toolbar .ui-delete');

    andThen(() => {
      // Сounting the number of validationmessage = 8 afther detail delete.
      $validationLablesContainer = $('.ember-view.ui.basic.label');
      assert.equal($validationLablesContainer.length, 8, 'Detail was deleted without errors');
    });
  });
});
/* eslint-enable no-unused-vars */
