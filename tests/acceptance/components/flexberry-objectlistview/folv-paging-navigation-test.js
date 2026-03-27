import $ from 'jquery';
import { executeTest } from './execute-folv-test';
import { deleteRecords, addRecords, refreshListByFunction } from './folv-tests-functions';
import generateUniqueId from 'ember-flexberry-data/utils/generate-unique-id';

executeTest('check paging nav', async (store, assert, app) => {
  assert.expect(29);
  const path = 'components-acceptance-tests/flexberry-objectlistview/folv-paging';
  const modelName = 'ember-flexberry-dummy-suggestion-type';
  const uuid = generateUniqueId();
  let last;

  // Add records for paging.
  let resolvedPromises = await addRecords(store, modelName, uuid);
  assert.ok(resolvedPromises, 'All records saved.');
  await visit(path + '?perPage=1');

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

  let refreshFunction =  async function() {
    let refreshButton = $basicButtons[4];
    await click( refreshButton);
  };

  await refreshListByFunction(refreshFunction, controller);
  $basicButtons = $('.ui.button', '.ui.basic.buttons');
  assert.equal($($basicButtons[1]).hasClass('active'), false, 'page 1 is not active');
  assert.equal($($basicButtons[4]).hasClass('active'), true, 'page 4 is active');
  assert.equal($($basicButtons[1])[0].innerText, 1, '1st page is depicted');
  assert.equal($($basicButtons[2])[0].innerText, '...', '... page is depicted');
  assert.equal($($basicButtons[3])[0].innerText, 3, '3rd page is depicted');
  assert.equal($($basicButtons[4])[0].innerText, 4, '4th page is depicted');
  assert.equal($($basicButtons[5])[0].innerText, 5, '5th page is depicted');
  assert.equal($($basicButtons[6])[0].innerText, '...', '... page is depicted');
  assert.equal($($basicButtons[7])[0].innerText, last, 'last page is depicted');

  refreshFunction = async function() {
    let refreshButton = $basicButtons[7];
    await click(refreshButton);
  };

  await refreshListByFunction(refreshFunction, controller);
  $basicButtons = $('.ui.button', '.ui.basic.buttons');
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
  
  await deleteRecords(store, modelName, uuid, assert);
});

