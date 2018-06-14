import $ from 'jquery';
import { run } from '@ember/runloop';
import { executeTest } from './execute-folv-test';
import { loadingList, deleteRecords, addRecords } from './folv-tests-functions';

import generateUniqueId from 'ember-flexberry-data/utils/generate-unique-id';

executeTest('check paging nav', (store, assert) => {
  assert.expect(7);
  let path = 'components-acceptance-tests/flexberry-objectlistview/folv-paging';
  let modelName = 'ember-flexberry-dummy-suggestion-type';
  let uuid = generateUniqueId();

  // Add records for paging.
  run(() => {
    addRecords(store, modelName, uuid).then(function(resolvedPromises) {
      assert.ok(resolvedPromises, 'All records saved.');

      visit(path);
      andThen(function() {
        assert.equal(currentPath(), path);

        // check paging.
        let $basicButtons = $('.ui.button', '.ui.basic.buttons');
        assert.equal($($basicButtons[0]).hasClass('disabled'), true, 'button prev is disabled');
        assert.equal($($basicButtons[1]).hasClass('active'), true, 'page 1 is active');

        let done = assert.async();
        loadingList($basicButtons[2], '.object-list-view-container', 'table.object-list-view tbody tr').then(($list) => {
          assert.ok($list);
          let $basicButtons = $('.ui.button', '.ui.basic.buttons');
          assert.equal($($basicButtons[1]).hasClass('active'), false, 'page 1 is not active');
          assert.equal($($basicButtons[2]).hasClass('active'), true, 'page 2 is active');
        }).catch((reason) => {
          // Error output.
          assert.ok(false, reason);
        }).finally(() => {
          deleteRecords(store, modelName, uuid).finally(done);
        });
      });
    });
  });
});
