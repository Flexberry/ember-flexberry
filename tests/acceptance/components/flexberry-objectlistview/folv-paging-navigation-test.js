import $ from 'jquery';
import { run } from '@ember/runloop';
import { executeTest } from './execute-folv-test';
import { deleteRecords, addRecords, refreshListByFunction } from './folv-tests-functions';
import generateUniqueId from 'ember-flexberry-data/utils/generate-unique-id';

executeTest('check paging nav', (store, assert, app) => {
  assert.expect(29);
  let path = 'components-acceptance-tests/flexberry-objectlistview/folv-paging';
  let modelName = 'ember-flexberry-dummy-suggestion-type';
  let uuid = generateUniqueId();
  let last;

  // Add records for paging.
  run(() => {
    addRecords(store, modelName, uuid).then(function(resolvedPromises) {
      assert.ok(resolvedPromises, 'All records saved.');
      let done = assert.async();
      visit(path + '?perPage=1');
      andThen(function() {
        assert.equal(currentPath(), path);
        let controller = app.__container__.lookup('controller:' + currentRouteName());

        // check paging.
        let $basicButtons = $('.ui.button', '.ui.basic.buttons');
        last = controller.get('model.meta.count');

        assert.equal($($basicButtons[0]).hasClass('disabled'), true, 'button prev is disabled');
        assert.equal($($basicButtons[1]).hasClass('active'), true, 'page 1 is active');
        assert.equal($($basicButtons[1])[0].innerText, 1, '1st page is depicted');
        assert.equal($($basicButtons[2])[0].innerText, 2, '2nd page is depicted');
        assert.equal($($basicButtons[3])[0].innerText, 3, '3rd page is depicted');
        assert.equal($($basicButtons[4])[0].innerText, 4, '4th page is depicted');
        assert.equal($($basicButtons[5])[0].innerText, '...', '... page is depicted');
        assert.equal($($basicButtons[6])[0].innerText, last, 'last page is depicted');

        let done1 = assert.async();
        let refreshFunction =  function() {
          let refreshButton = $basicButtons[4];
          refreshButton.click();
        };

        refreshListByFunction(refreshFunction, controller).then(() => {
          let $basicButtons = $('.ui.button', '.ui.basic.buttons');
          assert.equal($($basicButtons[1]).hasClass('active'), false, 'page 1 is not active');
          assert.equal($($basicButtons[4]).hasClass('active'), true, 'page 4 is active');
          assert.equal($($basicButtons[1])[0].innerText, 1, '1st page is depicted');
          assert.equal($($basicButtons[2])[0].innerText, '...', '... page is depicted');
          assert.equal($($basicButtons[3])[0].innerText, 3, '3rd page is depicted');
          assert.equal($($basicButtons[4])[0].innerText, 4, '4th page is depicted');
          assert.equal($($basicButtons[5])[0].innerText, 5, '5th page is depicted');
          assert.equal($($basicButtons[6])[0].innerText, '...', '... page is depicted');
          assert.equal($($basicButtons[7])[0].innerText, last, 'last page is depicted');

          let done2 = assert.async();
          let refreshFunction =  function() {
            let refreshButton = $basicButtons[7];
            refreshButton.click();
          };

          refreshListByFunction(refreshFunction, controller).then(() => {
            let $basicButtons = $('.ui.button', '.ui.basic.buttons');
            assert.equal($($basicButtons[4]).hasClass('active'), false, 'page 4 is not active');
            assert.equal($($basicButtons[6]).hasClass('active'), true, 'last page is active');
            assert.equal($($basicButtons[7]).hasClass('disabled'), true, 'button next is disabled');
            assert.equal($($basicButtons[6])[0].innerText, last, 'last page is depicted');
            assert.equal($($basicButtons[1])[0].innerText, 1, '1st page is depicted');
            assert.equal($($basicButtons[2])[0].innerText, '...', '... page is depicted');
            assert.equal($($basicButtons[3])[0].innerText, last - 3, 'n-3 page is depicted');
            assert.equal($($basicButtons[4])[0].innerText, last - 2, 'n-2 page is depicted');
            assert.equal($($basicButtons[5])[0].innerText, last - 1, 'n-1 page is depicted');
            assert.equal($($basicButtons[6])[0].innerText, last, 'last page is depicted');
          }).catch((reason) => {
            throw new Error(reason);
          }).finally(() => {
            deleteRecords(store, modelName, uuid, assert);
            done2();
            done();
          });
        }).catch((reason) => {
          throw new Error(reason);
        }).finally(() => {
          deleteRecords(store, modelName, uuid, assert);
          done1();
        });
      });
    });
  });
});

