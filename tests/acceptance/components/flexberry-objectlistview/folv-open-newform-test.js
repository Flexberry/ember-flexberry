import { executeTest } from './execute-folv-test';

executeTest('check goto new form', async (store, assert, app) => {
  const path = 'components-acceptance-tests/flexberry-objectlistview/base-operations';
  await visit(path);
  const controller = app.__container__.lookup('controller:' + currentRouteName());
  const newFormRoute = controller.get('editFormRoute') + '.new';
  await goToNewForm('[data-test-olv]', null, assert, newFormRoute);
});