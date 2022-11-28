import { get } from '@ember/object';
import { registerAsyncHelper, registerWaiter, unregisterWaiter } from '@ember/test';
import moment from 'moment';
import generateUniqueId from 'ember-flexberry-data/utils/generate-unique-id';
import { createRecord } from './utils/create-recort-for-test';

registerAsyncHelper('checkDeleteRecordFromEditForm',
  function(app, olvSelector, context, assert, store, model, prop) {
    const helpers = app.testHelpers;
    const olv = helpers.findWithAssert(olvSelector, context);

    const currentData = moment().format('DD.MM.YYYY HH:mm');
    const deleteRecordId = generateUniqueId();

    createRecord(store, model, prop, deleteRecordId, currentData).then(() => {
      assert.expect(assert.expect() + 4);

      const currentPathPage = helpers.currentPath();
      helpers.visit(`${currentPathPage}?filter=${currentData} ${deleteRecordId}`);
      helpers.andThen(() => {
        const helperColumn = helpers.find('tbody .object-list-view-helper-column', olv).toArray();
        const row = helpers.find('tbody tr', olv);
        const cell = helpers.find('td', row)[1];

        assert.equal(1, helperColumn.length);

        const controller = app.__container__.lookup(`controller:${helpers.currentPath()}`);
        const editFormRoute = get(controller, 'editFormRoute');
        const waiterFunction = () => { return helpers.currentPath() === editFormRoute };

        registerWaiter(waiterFunction);
        helpers.click(cell);
        helpers.andThen(() => {
          const deleteButton = helpers.find('.flexberry-edit-panel .save-del-button');

          assert.equal(helpers.currentPath(), editFormRoute);

          unregisterWaiter(waiterFunction);
          helpers.click(deleteButton);
          helpers.andThen(() => {
            assert.equal(helpers.currentPath(), currentPathPage);

            helpers.visit(`${currentPathPage}?filter=${currentData} ${deleteRecordId}`);
            helpers.andThen(() => {
              const helperColumn = helpers.find('tbody .object-list-view-helper-column', olv).toArray();
              assert.equal(0, helperColumn.length);
            });
          });
        });
      });
    });
  }
);
