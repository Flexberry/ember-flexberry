import $ from 'jquery';
import { executeTest} from './execute-validation-test';

/* eslint-disable no-unused-vars */
executeTest('check detail delete', async(store, assert, app) => {
  assert.expect(3);
  let path = 'components-acceptance-tests/edit-form-validation/validation';

  // Open validation page.
  await visit(path);

    assert.equal(currentPath(), path);

    // Сounting the number of validationmessage.
    let $validationLablesContainer = $('.ember-view.ui.basic.label');
    assert.equal($validationLablesContainer.length, 11, 'All components have default value');

    // Delete detail.
    await click('.groupedit-new-row .flexberry-checkbox:first');
    await click('.groupedit-toolbar .ui-delete');

      // Сounting the number of validationmessage = 8 afther detail delete.
      $validationLablesContainer = $('.ember-view.ui.basic.label');
      assert.equal($validationLablesContainer.length, 8, 'Detail was deleted without errors');
    });
/* eslint-enable no-unused-vars */
