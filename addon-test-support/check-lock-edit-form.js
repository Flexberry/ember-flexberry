import { all } from 'rsvp';
import { get } from '@ember/object';
import { registerAsyncHelper } from '@ember/test';
import { registerWaiter, unregisterWaiter } from '@ember/test';

import moment from 'moment';
import generateUniqueId from 'ember-flexberry-data/utils/generate-unique-id';
import { createRecord } from './utils/create-recort-for-test';

registerAsyncHelper('checkLockEditForm',
  function(app, olvSelector, context, assert, store, model, prop, path) {
    const helpers = app.testHelpers;
    const olv = helpers.findWithAssert(olvSelector, context);

    const currentData = moment().format('DD.MM.YYYY HH:mm');
    const testRecord = generateUniqueId();
    const lockRecord = store.createRecord('new-platform-flexberry-services-lock', {
      lockKey: testRecord,
      userName: 'AutoTestUser',
      lockDate: currentData
    });

    all([
      createRecord(store, model, prop, testRecord, currentData),
      lockRecord.save()
    ]).then(() => {

      assert.expect(assert.expect() + 11);

      helpers.visit(`${helpers.currentPath()}?filter=${currentData} ${testRecord}`);
      helpers.andThen(() => {
        const helperColumn = helpers.find('tbody .object-list-view-helper-column', olv).toArray();
        const row = helpers.find('tbody tr', olv);
        const cell = helpers.find('td', row)[1];

        assert.equal(1, helperColumn.length);

        const controller = app.__container__.lookup(`controller:${path}`);
        const editFormRoute = get(controller, 'editFormRoute');
        const waiterFunction = () => { return helpers.currentPath() === editFormRoute };

        registerWaiter(waiterFunction);
        helpers.click(cell);
        helpers.andThen(() => {
          const saveButton = helpers.find('.flexberry-edit-panel .save-button').toArray();
          const deleteButton = helpers.find('.flexberry-edit-panel .save-del-button').toArray();
          const closeButton = helpers.find('.flexberry-edit-panel .close-button').toArray();

          assert.equal(helpers.currentPath(), editFormRoute);
          assert.equal(0, saveButton.length);
          assert.equal(0, deleteButton.length);
          assert.equal(1, closeButton.length);

          unregisterWaiter(waiterFunction);
          helpers.click(closeButton);
          helpers.andThen(() => {
            assert.equal(helpers.currentPath(), path);

            lockRecord.destroyRecord().then(() => {
              helpers.visit(`${helpers.currentPath()}?filter=${currentData} ${testRecord}`);
              helpers.andThen(() => {
                const helperColumn = helpers.find('tbody .object-list-view-helper-column').toArray();
                const row = helpers.find('tbody tr');
                const cell = helpers.find('td', row)[1];

                assert.equal(1, helperColumn.length);

                registerWaiter(waiterFunction);
                helpers.click(cell);
                helpers.andThen(() => {
                  const saveButton = helpers.find('.flexberry-edit-panel .save-button').toArray();
                  const deleteButton = helpers.find('.flexberry-edit-panel .save-del-button').toArray();
                  const closeButton = helpers.find('.flexberry-edit-panel .close-button').toArray();

                  assert.equal(helpers.currentPath(), editFormRoute);
                  assert.equal(1, saveButton.length);
                  assert.equal(1, deleteButton.length);
                  assert.equal(1, closeButton.length);

                  unregisterWaiter(waiterFunction);
                  helpers.click(deleteButton);
                });
              });
            });
          });
        });
      });
    });
  }
);
