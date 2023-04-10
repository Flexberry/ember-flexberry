import { all } from 'rsvp';
import { registerAsyncHelper } from '@ember/test';
import moment from 'moment';
import generateUniqueId from 'ember-flexberry-data/utils/generate-unique-id';

registerAsyncHelper('checkDeleteRecordFromOlv',
  function(app, olvSelector, context, assert, store, model, prop) {
    const helpers = app.testHelpers;
    const olv = helpers.findWithAssert(olvSelector, context);

    const currentData = moment().format('DD.MM.YYYY HH:mm');
    const deleteUseRowButton = generateUniqueId();
    const deleteUseRowMeny = generateUniqueId();
    const deleteUseToolbar1 = generateUniqueId();
    const deleteUseToolbar2 = generateUniqueId();

    all([
      createRecord(store, model, prop, deleteUseRowButton, currentData),
      createRecord(store, model, prop, deleteUseRowMeny, currentData),
      createRecord(store, model, prop, deleteUseToolbar1, currentData),
      createRecord(store, model, prop, deleteUseToolbar2, currentData)
    ]).then(() => {

      assert.expect(assert.expect() + 6);

      // Delete use row button.
      helpers.visit(`${helpers.currentPath()}?filter=${currentData} ${deleteUseRowButton}`);
      helpers.andThen(() => {
        const helperColumn = helpers.find('tbody .object-list-view-helper-column', olv).toArray();
        const deletaRowButton = helpers.find('.object-list-view-row-delete-button', helperColumn);
        assert.equal(1, helperColumn.length);

        helpers.click(deletaRowButton);
        helpers.click('.menu .refresh-button');
        helpers.andThen(() => {
          const helperColumn = helpers.find('tbody .object-list-view-helper-column', olv).toArray();
          assert.equal(0, helperColumn.length);

          // Delete use row meny.
          helpers.visit(`${helpers.currentPath()}?filter=${currentData} ${deleteUseRowMeny}`);
          helpers.andThen(() => {
            const menuColumn = helpers.find('tbody .object-list-view-menu', olv).toArray();
            const deletaRowButton = helpers.find('.item.delete-menu', menuColumn);
            assert.equal(1, menuColumn.length);

            helpers.click(deletaRowButton);
            helpers.click('.menu .refresh-button');
            helpers.andThen(() => {
              const helperColumn = helpers.find('tbody .object-list-view-helper-column', olv).toArray();
              assert.equal(0, helperColumn.length);

              // Delete use toolBar.
              helpers.visit(`${helpers.currentPath()}?filter=${currentData}`);
              helpers.andThen(() => {
                const helperColumn = helpers.find('tbody .object-list-view-helper-column', olv).toArray();
                const checkboxRowButton = helpers.find('.flexberry-checkbox', helperColumn).toArray();
                assert.equal(2, helperColumn.length);

                checkboxRowButton.forEach((checkbox) => { helpers.click(checkbox); });
                helpers.andThen(() => {
                  const deleteToolbarButton = helpers.find('.menu .delete-button', olv);
                  helpers.click(deleteToolbarButton);
                  helpers.click('.menu .refresh-button');
                  helpers.andThen(() => {
                    const helperColumn = helpers.find('tbody .object-list-view-helper-column', olv).toArray();
                    assert.equal(0, helperColumn.length);
                  });
                });
              });
            });
          });
        });
      });
    });
  }
);

// Create record.
let createRecord = function(store, model, prop, id, data) {
  let record = store.createRecord(model, {
    id: id
  });

  record.set(`${prop}`, `${data} ${id}`);

  return record.save();
};
