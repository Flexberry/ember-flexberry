import { run } from '@ember/runloop';
import $ from 'jquery';
import RSVP from 'rsvp';
import { A } from '@ember/array';
import { executeTest, addDataForDestroy } from './execute-folv-test';
import { loadingList } from './folv-tests-functions';

import generateUniqueId from 'ember-flexberry-data/utils/generate-unique-id';

import FilterOperator from 'ember-flexberry-data/query/filter-operator';
import Builder from 'ember-flexberry-data/query/builder';

/* eslint-disable no-unused-vars */
executeTest('check delete using button on toolbar', (store, assert, app) => {
  assert.expect(5);
  let path = 'components-acceptance-tests/flexberry-objectlistview/folv-paging';

  let modelName = 'ember-flexberry-dummy-suggestion-type';
  let howAddRec = 2;
  let uuid = '0' + generateUniqueId();

  // Add records for deliting.
  run(() => {
    let newRecords = A();

    for (let i = 0; i < howAddRec; i++) {
      newRecords.pushObject(store.createRecord('ember-flexberry-dummy-suggestion-type', { name: uuid }));
    }

    let done2 = assert.async();
    let promises = A();
    newRecords.forEach(function(item) {
      promises.push(item.save());
    });

    addDataForDestroy(newRecords);

    RSVP.Promise.all(promises).then(function(resolvedPromises) {
      assert.ok(resolvedPromises, 'All records saved.');

      let builder = new Builder(store).from(modelName).count();
      let done1 = assert.async();
      store.query(modelName, builder.build()).then((result) => {
        visit(path + '?perPage=' + result.meta.count);
        andThen(() => {
          assert.equal(currentPath(), path);
          let olvContainerClass = '.object-list-view-container';
          let trTableClass = 'table.object-list-view tbody tr';

          let $folvContainer = $(olvContainerClass);
          let $rows = () => { return $(trTableClass, $folvContainer).toArray(); };

          // Check that the records have been added.
          let recordIsForDeleting = $rows().reduce((sum, current) => {
            let nameRecord = $.trim(current.children[1].innerText);
            let flag = (nameRecord.indexOf(uuid) >= 0);
            return sum + flag;
          }, 0);

          assert.equal(recordIsForDeleting, howAddRec, howAddRec + ' records added');

          let checkRecords = function() {
            promises.clear();
            $rows().forEach((row) => {
              let nameRecord = $.trim(row.children[1].innerText);
              let $firstCell = $('.object-list-view-helper-column-cell', row);
              let checkboxInRow = $('.flexberry-checkbox', $firstCell)[0];
              if (nameRecord.indexOf(uuid) >= 0) {
                promises.pushObject(click(checkboxInRow));
              }
            });

            return RSVP.Promise.all(promises);
          };

          checkRecords().then(() => {
            let $toolBar = $('.ui.secondary.menu')[0];
            let $deleteButton = $toolBar.children[2];
            let done = assert.async();

            // Delete the marked records.
            /* eslint-disable no-unused-vars */
            loadingList($deleteButton, olvContainerClass, trTableClass).then(($list) => {
              let recordsIsDelete = $rows().every((element) => {
                let nameRecord = $.trim(element.children[1].innerText);
                return nameRecord.indexOf(uuid) < 0;
              });

              assert.ok(recordsIsDelete, 'Each entry begins with \'' + uuid + '\' is delete with button in toolbar button');

              // Check that the records have been removed into store.
              let builder2 = new Builder(store).from(modelName).where('name', FilterOperator.Eq, uuid).count();
              let done3 = assert.async();
              store.query(modelName, builder2.build()).then((result) => {
                assert.notOk(result.meta.count, 'records \'' + uuid + '\'not found in store');
                done3();
              });
              done();
            });
            /* eslint-enable no-unused-vars */
          });
        });
        done1();
      });
      done2();
    });
  });
});
/* eslint-enable no-unused-vars */