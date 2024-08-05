import { executeTest } from './execute-folv-test';
import { settled } from '@ember/test-helpers';
import { isBlank } from '@ember/utils';

executeTest('check goto editform', async (store, assert, app) => {
  const path = 'components-acceptance-tests/flexberry-objectlistview/base-operations';
  await visit(path);

  // Ждем, пока все асинхронные операции завершатся
  await settled();

  const controller = app.__container__.lookup('controller:' + currentRouteName());
  const editFormRoute = controller.get('editFormRoute');

  // Проверяем, что editFormRoute существует
  assert.ok(editFormRoute, 'editFormRoute is defined');

  // Проверяем, что элемент для открытия формы редактирования существует
  const olvElement = document.querySelector('[data-test-olv]');
  assert.ok(olvElement, 'Object List View element is present');

  if (isBlank(editFormRoute)) {
    throw new Error('editFormRoute can\'t be undefined');
  }

  const helpers = app.testHelpers;
  const olv = helpers.findWithAssert(olvElement);
  
  const rows = helpers.findWithAssert('.object-list-view-container table.object-list-view tbody tr', olv);

  controller.set('rowClickable', true);

  const timeout = 1000;

  // Ждем, чтобы убедиться, что все асинхронные операции завершены
  await settled();

  // Кликаем по нужной строке
  await click(rows[1].children[1]);

  // Ждем, чтобы убедиться, что переход на маршрут завершен
  await settled();

  // Проверяем, что мы находимся на нужном маршруте
  assert.equal(helpers.currentRouteName(), editFormRoute, 'on edit route');
});
