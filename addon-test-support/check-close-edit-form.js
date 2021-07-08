import { get } from '@ember/object';
import { registerAsyncHelper } from '@ember/test';
import { registerWaiter, unregisterWaiter } from '@ember/test';

registerAsyncHelper('checkCloseEditForm',
  function(app, olvSelector, context, assert, path) {
    const helpers = app.testHelpers;
    const olv = helpers.findWithAssert(olvSelector, context);

    assert.expect(assert.expect() + 3);

    const helperColumn = helpers.find('tbody .object-list-view-helper-column', olv).toArray();
    const row = helpers.find('tbody tr', olv);
    const cell = helpers.find('td', row)[1];

    assert.notEqual(0, helperColumn.length);

    const controller = app.__container__.lookup(`controller:${path}`);
    const editFormRoute = get(controller, 'editFormRoute');
    const waiterFunction = () => { return helpers.currentPath() === editFormRoute };

    registerWaiter(waiterFunction);
    helpers.click(cell);
    helpers.andThen(() => {
      const deleteButton = helpers.find('.flexberry-edit-panel .close-button');

      assert.equal(helpers.currentPath(), editFormRoute);

      unregisterWaiter(waiterFunction);
      helpers.click(deleteButton);
      helpers.andThen(() => {
        assert.equal(helpers.currentPath(), path);
      });
    });
  }
);
