import Ember from 'ember';
import { executeTest } from './execute-folv-test';
import generateUniqueId from 'ember-flexberry-data/utils/generate-unique-id';

import { Query } from 'ember-flexberry-data';
const { Builder } = Query;

executeTest('check delete before record with promise data cancel test', (store, assert, app) => {
  assert.expect(5);
  let path = 'components-examples/flexberry-objectlistview/before-delete-record/folv-for-before-delete-record-with-promise-data-cancel';
  let modelName = 'ember-flexberry-dummy-suggestion-type';
  let howAddRec = 1;
  let uuid = '0' + generateUniqueId();

  // Add records for deliting.
  Ember.run(() => {
    let newRecord = store.createRecord(modelName, { name: uuid });
    let done1 = assert.async();

    newRecord.save().then(() => {
      let builder = new Builder(store).from(modelName).count();
      let done = assert.async();
      store.query(modelName, builder.build()).then((result) => {
        visit(path + '?perPage=' + result.meta.count);
        andThen(() => {
          assert.equal(currentPath(), path);

          let olvContainerClass = '.object-list-view-container';
          let trTableClass = 'table.object-list-view tbody tr';

          let $folvContainer = Ember.$(olvContainerClass);
          let $rows = () => { return Ember.$(trTableClass, $folvContainer).toArray(); };

          // Check that the records have been added.
          let recordIsForDeleting = $rows().reduce((sum, element) => {
            let nameRecord = Ember.$.trim(element.children[1].innerText);
            let flag = nameRecord.indexOf(uuid) >= 0;
            return sum + flag;
          }, 0);

          assert.equal(recordIsForDeleting > 0, true, howAddRec + ' record added');

          $rows().forEach(function(element, i, arr)  {
            let nameRecord = Ember.$.trim(element.children[1].innerText);
            if (nameRecord.indexOf(uuid) >= 0) {
              let $deleteBtnInRow = Ember.$('.object-list-view-row-delete-button', element);
              $deleteBtnInRow.click();
            }
          });

          // Check that the records wasn't remove in beforeDeleteRecord.
          let controller = app.__container__.lookup('controller:' + currentRouteName());
          assert.ok(controller.recordWasNotDelete, 'Records wasn\'t remove in beforeDeleteRecord');

          // Check that the records haven't been removed.
          let recordsIsDeleteBtnInRow = $rows().every((element) => {
            let nameRecord = Ember.$.trim(element.children[1].innerText);
            return nameRecord.indexOf(uuid) < 0;
          });

          assert.notOk(recordsIsDeleteBtnInRow, 'Each entry begins with \'' + uuid + '\' is delete with button in row');

          // Check that the records haven't been removed into store.
          let builder2 = new Builder(store, modelName).where('name', Query.FilterOperator.Eq, uuid).count();
          let timeout = 500;
          Ember.run.later((function() {
            let done2 = assert.async();
            store.query(modelName, builder2.build()).then((result) => {
              assert.ok(result.meta.count, 'record \'' + uuid + '\'not found in store');
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
