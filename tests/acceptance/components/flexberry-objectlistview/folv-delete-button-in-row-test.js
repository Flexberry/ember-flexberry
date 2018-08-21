import { later, run } from '@ember/runloop';
import $ from 'jquery';
import { executeTest, addDataForDestroy } from './execute-folv-test';
import generateUniqueId from 'ember-flexberry-data/utils/generate-unique-id';

import FilterOperator from 'ember-flexberry-data/query/filter-operator';
import Builder from 'ember-flexberry-data/query/builder';

/* eslint-disable no-unused-vars */
executeTest('check delete button in row', (store, assert, app) => {
  assert.expect(4);
  let path = 'components-acceptance-tests/flexberry-objectlistview/folv-paging';
  let modelName = 'ember-flexberry-dummy-suggestion-type';
  let howAddRec = 1;
  let uuid = '0' + generateUniqueId();

  // Add records for deliting.
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

          // Check that the records have been added.
          let recordIsForDeleting = $rows().reduce((sum, element) => {
            let nameRecord = $.trim(element.children[1].innerText);
            let flag = nameRecord.indexOf(uuid) >= 0;
            return sum + flag;
          }, 0);

          assert.equal(recordIsForDeleting, howAddRec, howAddRec + ' record added');

          /* eslint-disable no-unused-vars */
          $rows().forEach(function(element, i, arr)  {
            let nameRecord = $.trim(element.children[1].innerText);
            if (nameRecord.indexOf(uuid) >= 0) {
              let $deleteBtnInRow = $('.object-list-view-row-delete-button', element);
              run(() => {
                $deleteBtnInRow.click();
              });
            }
          });
          /* eslint-enable no-unused-vars */

          // Check that the records have been removed.
          let recordsIsDeleteBtnInRow = $rows().every((element) => {
            let nameRecord = $.trim(element.children[1].innerText);
            return nameRecord.indexOf(uuid) < 0;
          });

          assert.ok(recordsIsDeleteBtnInRow, 'Each entry begins with \'' + uuid + '\' is delete with button in row');

          // Check that the records have been removed into store.
          let builder2 = new Builder(store, modelName).where('name', FilterOperator.Eq, uuid).count();
          let timeout = 500;
          later((function() {
            let done2 = assert.async();
            store.query(modelName, builder2.build()).then((result) => {
              assert.notOk(result.meta.count, 'record \'' + uuid + '\'not found in store');
              done2();
            });
          }), timeout);
        });
        done();
      });
      done1();
    });
  });
});
/* eslint-enable no-unused-vars */
