import { later, run } from '@ember/runloop';
import $ from 'jquery';
import { executeTest, addDataForDestroy } from './execute-folv-test';
import generateUniqueId from 'ember-flexberry-data/utils/generate-unique-id';
import { click } from '@ember/test-helpers';

import FilterOperator from 'ember-flexberry-data/query/filter-operator';
import Builder from 'ember-flexberry-data/query/builder';

executeTest('check delete button in row', async (store, assert, app) => {
  assert.expect(4);
  const path = 'components-acceptance-tests/flexberry-objectlistview/folv-paging';
  const modelName = 'ember-flexberry-dummy-suggestion-type';
  const howAddRec = 1;
  const uuid = '0' + generateUniqueId();

  // Add records for deleting.
  await run(async () => {
    let newRecord = store.createRecord(modelName, { name: uuid });

    await newRecord.save();
    addDataForDestroy(newRecord);

    let builder = new Builder(store).from(modelName).count();
    let result = await store.query(modelName, builder.build());
    await visit(path + '?perPage=' + result.meta.count);
  });

  assert.equal(currentPath(), path);

  let olvContainerClass = '.object-list-view-container';
  let trTableClass = 'table.object-list-view tbody tr';

  let $folvContainer = $(olvContainerClass);
  let $rows = () => { return $(trTableClass, $folvContainer).toArray(); };

  // Check that the records have been added.
  let recordIsForDeleting = await run(() => {
    return $rows().reduce((sum, element) => {
      let nameRecord = $.trim(element.children[1].innerText);
      let flag = nameRecord.indexOf(uuid) >= 0;
      return sum + flag;
    }, 0);
  });

  assert.equal(recordIsForDeleting, howAddRec, howAddRec + ' record added');

  /* eslint-disable no-unused-vars */
  let clickPromises = [];
  $rows().forEach(function(element) {
    let nameRecord = $.trim(element.children[1].innerText);
    if (nameRecord.indexOf(uuid) >= 0) {
      let $deleteBtnInRow = $('.object-list-view-row-delete-button', element)[0];
      clickPromises.push(run(() => click($deleteBtnInRow)));
    }
  });
  /* eslint-enable no-unused-vars */

  await Promise.all(clickPromises);

  // Check that the records have been removed.
  let recordsIsDeleteBtnInRow = await run(() => {
    return $rows().every((element) => {
      let nameRecord = $.trim(element.children[1].innerText);
      return nameRecord.indexOf(uuid) < 0;
    });
  });

  assert.ok(recordsIsDeleteBtnInRow, 'Each entry begins with \'' + uuid + '\' is delete with button in row');

  // Check that the records have been removed into store.
  let builder2 = new Builder(store, modelName).where('name', FilterOperator.Eq, uuid).count();
  let timeout = 500;
  await new Promise(resolve => {
    run(() => {
      later(async () => {
        let result = await store.query(modelName, builder2.build());
        assert.notOk(result.meta.count, 'record \'' + uuid + '\' not found in store');
        resolve();
      }, timeout);
    });
  });
});
/* eslint-enable no-unused-vars */