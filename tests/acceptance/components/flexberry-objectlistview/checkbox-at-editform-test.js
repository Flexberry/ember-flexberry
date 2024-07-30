import $ from 'jquery';
import { executeTest  } from './execute-folv-test';
import { loadingList } from './folv-tests-functions';

executeTest('check checkbox at editform', async (store, assert, app) => {
  assert.expect(2);
  let path = 'components-acceptance-tests/flexberry-checkbox/ember-flexberry-dummy-suggestion-list-with-checked-checkbox';
  await visit(path);

  let controller = app.__container__.lookup('controller:' + currentRouteName());
  let $folvContainer = $('.object-list-view-container');
  let $trTableBody = $('table.object-list-view tbody tr', $folvContainer);
  let $cell = $trTableBody.length > 0 ? $trTableBody[0].children[1] : null;
  controller.set('rowClickable', true);

  // Загружаем форму редактирования
  try {
    let $editForm = await loadingList($cell, 'form.flexberry-vertical-form', '.field');
    let checkbox = $('.flexberry-checkbox');

    assert.ok($editForm, 'edit form open');
    assert.equal(checkbox.hasClass('checked'), true, 'checkbox is checked');
  } catch (reason) {
    // Выводим ошибку
    assert.ok(false, reason);
  }
});