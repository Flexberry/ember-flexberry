import { executeTest, addDataForDestroy } from './execute-folv-test';
import { run, later } from '@ember/runloop';
import generateUniqueId from 'ember-flexberry-data/utils/generate-unique-id';
import Builder from 'ember-flexberry-data/query/builder';
import FilterOperator from 'ember-flexberry-data/query/filter-operator';
import { click } from '@ember/test-helpers';
import $ from 'jquery';

executeTest('check delete before record with promise data immediately test', async (store, assert, app) => {
  assert.expect(5);
  const path = 'components-examples/flexberry-objectlistview/before-delete-record/folv-for-before-delete-record-with-promise-data-immediately';
  const modelName = 'ember-flexberry-dummy-suggestion-type';
  const howAddRec = 1;
  const uuid = '0' + generateUniqueId();

  // Add records for deliting.
  await run(async() => {
    let newRecord = store.createRecord(modelName, { name: uuid });
  
    await newRecord.save();
    addDataForDestroy(newRecord);

    let builder = new Builder(store).from(modelName).count();
    let result = await store.query(modelName, builder.build());
    await visit(path + '?perPage=' + result.meta.count);
      
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

    assert.equal(recordIsForDeleting > 0, true, howAddRec + ' record added');

    /* eslint-disable no-unused-vars */
    let clickPromises = [];
    $rows().forEach(function(element)  {
      let nameRecord = $.trim(element.children[1].innerText);
      if (nameRecord.indexOf(uuid) >= 0) {
        let $deleteBtnInRow = $('.object-list-view-row-delete-button', element)[0];
        clickPromises.push(click($deleteBtnInRow));
      }
    });
          /* eslint-enable no-unused-vars */

    await Promise.all(clickPromises);

    // Check that the records wasn't remove in beforeDeleteRecord.
    let controller = app.__container__.lookup('controller:' + currentRouteName());
    assert.ok(controller.recordWasNotDelete, 'Records wasn\'t remove in beforeDeleteRecord');

    // Check if the records wasn't removed.
    let recordsIsDeleteBtnInRow = $rows().every((element) => {
      let nameRecord = $.trim(element.children[1].innerText);
      return nameRecord.indexOf(uuid) < 0;
    });

    assert.ok(recordsIsDeleteBtnInRow, 'Each entry begins with \'' + uuid + '\' is delete with button in row');

    // Check that the records have been removed from store.
    let builder2 = new Builder(store, modelName).where('name', FilterOperator.Eq, uuid).count();
    let timeout = 500;
    await new Promise(resolve => 
      later(async() => {
        let result = await store.query(modelName, builder2.build());
        assert.ok(result.meta.count, 'record \'' + uuid + '\'not found in store');
        resolve();
        await newRecord.destroyRecord();
      }, timeout));
  });
});