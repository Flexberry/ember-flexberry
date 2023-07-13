import { executeTest, addDataForDestroy } from './execute-folv-test';
import { run, later } from '@ember/runloop';
import generateUniqueId from 'ember-flexberry-data/utils/generate-unique-id';
import Builder from 'ember-flexberry-data/query/builder';
import FilterOperator from 'ember-flexberry-data/query/filter-operator';
import { click } from '@ember/test-helpers';
import $ from 'jquery';

executeTest('check delete before record data immediately test', (store, assert, app) => {
  assert.expect(5);
  let path = 'components-examples/flexberry-objectlistview/before-delete-record/folv-for-before-delete-record-data-immediately';
  let modelName = 'ember-flexberry-dummy-suggestion-type';
  let howAddRec = 1;
  let uuid = '0' + generateUniqueId();

  // Add record for deleting.
  run(() => {
    let newRecord = store.createRecord(modelName, { name: uuid });
    let done1 = assert.async();

    newRecord.save().then(() => {
      addDataForDestroy(newRecord);
      let builder = new Builder(store).from(modelName).count();
      let done = assert.async();
      store.query(modelName, builder.build()).then((result) => {
        visit(path + '?perPage=' + result.meta.count);
        andThen(() => {
          assert.equal(currentPath(), path);

          let olvContainerClass = '.object-list-view-container';
          let trTableClass = 'table.object-list-view tbody tr';

          let $folvContainer = $(olvContainerClass);
          let $rows = () => { return $(trTableClass, $folvContainer).toArray(); };

          // Check that the record have been added.
          let recordIsForDeleting = $rows().reduce((sum, element) => {
            let nameRecord = $.trim(element.children[1].innerText);
            let flag = nameRecord.indexOf(uuid) >= 0;
            return sum + flag;
          }, 0);

          assert.equal(recordIsForDeleting > 0, true, howAddRec + ' record added');

          /* eslint-disable no-unused-vars */
          let clickPromises = [];
          $rows().forEach(function(element, i, arr)  {
            let nameRecord = $.trim(element.children[1].innerText);
            if (nameRecord.indexOf(uuid) >= 0) {
              let $deleteBtnInRow = $('.object-list-view-row-delete-button', element)[0];
              clickPromises.push(click($deleteBtnInRow));
            }
          });
          /* eslint-enable no-unused-vars */

          Promise.all(clickPromises).then(() => {
            let done2 = assert.async();

            // Check that the records wasn't removed in beforeDeleteRecord.
            let controller = app.__container__.lookup('controller:' + currentRouteName());
            assert.ok(controller.recordWasNotDelete, 'Records wasn\'t remove in beforeDeleteRecord');

            // Check if the records haven't been removed.
            let recordsIsDeleteBtnInRow = $rows().every((element) => {
              let nameRecord = $.trim(element.children[1].innerText);
              return nameRecord.indexOf(uuid) < 0;
            });

            assert.ok(recordsIsDeleteBtnInRow, 'Each entry begins with \'' + uuid + '\' was deleted with button in row');

            // Check that the records have been removed from store.
            let builder2 = new Builder(store, modelName).where('name', FilterOperator.Eq, uuid).count();
            let timeout = 500;
            later((function() {
              store.query(modelName, builder2.build()).then((result) => {
                assert.ok(result.meta.count, 'record \'' + uuid + '\'not found in store');
                done2();
              }).finally(() => {
                newRecord.destroyRecord();
              });
            }), timeout);
          });
        });
        done();
      });
      done1();
    });
  });
});
