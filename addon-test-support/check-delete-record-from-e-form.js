import Ember from 'ember';
import moment from 'moment';
import generateUniqueId from 'ember-flexberry-data/utils/generate-unique-id';
import { createRecord } from './utils/create-recort-for-test';

Ember.Test.registerAsyncHelper('checkDeleteRecordFromEditForm',
  function(app, olvSelector, context, assert, store, model, prop) {
    const helpers = app.testHelpers;
    const olv = helpers.findWithAssert(olvSelector, context);

    const currentData = moment().format('DD.MM.YYYY HH:mm');
    const deleteRecordId = generateUniqueId();

    createRecord(store, model, prop, deleteRecordId, currentData).then(() => {
      assert.expect(assert.expect() + 4);

      const currentPathPage = currentPath();
      visit(`${currentPathPage}?filter=${currentData} ${deleteRecordId}`);
      andThen(() => {
        const helperColumn = helpers.find('tbody .object-list-view-helper-column', olv).toArray();
        const row = helpers.find('tbody tr', olv);
        const cell = helpers.find('td', row)[1];

        assert.equal(1, helperColumn.length);

        const controller = app.__container__.lookup(`controller:${currentPath()}`);
        const editFormRoute = Ember.get(controller, 'editFormRoute');
        const waiterFunction = () => { return currentPath() === editFormRoute };

        Ember.Test.registerWaiter(waiterFunction);
        click(cell);
        andThen(() => {
          const deleteButton = helpers.find('.flexberry-edit-panel .save-del-button');

          assert.equal(currentPath(), editFormRoute);

          Ember.Test.unregisterWaiter(waiterFunction);
          click(deleteButton);
          andThen(() => {
            assert.equal(currentPath(), currentPathPage);

            visit(`${currentPathPage}?filter=${currentData} ${deleteRecordId}`);
            andThen(() => {
              const helperColumn = helpers.find('tbody .object-list-view-helper-column', olv).toArray();
              assert.equal(0, helperColumn.length);
            });
          });
        });
      });
    });
  }
);
