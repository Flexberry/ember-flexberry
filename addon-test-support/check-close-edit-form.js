import Ember from 'ember';

Ember.Test.registerAsyncHelper('checkCloseEditForm',
  function(app, olvSelector, context, assert, path) {
    const helpers = app.testHelpers;
    const olv = helpers.findWithAssert(olvSelector, context);

    assert.expect(assert.expect() + 3);

    const helperColumn = helpers.find('tbody .object-list-view-helper-column', olv).toArray();
    let row = helpers.find('tbody tr', olv);
    let cell = helpers.find('td', row)[1];

    assert.notEqual(0, helperColumn.length);

    let controller = app.__container__.lookup(`controller:${path}`);
    let editFormRoute = Ember.get(controller, 'editFormRoute');
    let waiterFunction = () => { return currentPath() === editFormRoute };

    Ember.Test.registerWaiter(waiterFunction);
    click(cell);
    andThen(() => {
      const deleteButton = helpers.find('.flexberry-edit-panel .close-button');

      assert.equal(currentPath(), editFormRoute);

      Ember.Test.unregisterWaiter(waiterFunction);
      click(deleteButton);
      andThen(() => {
        assert.equal(currentPath(), path);
      });
    });
  }
);
