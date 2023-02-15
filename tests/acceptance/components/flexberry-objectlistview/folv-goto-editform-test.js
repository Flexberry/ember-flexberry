import { executeTest } from './execute-folv-test';

executeTest('check goto editform', (store, assert, app) => {
  let path = 'components-acceptance-tests/flexberry-objectlistview/base-operations';
  visit(path);

  andThen(() => {
    const controller = app.__container__.lookup('controller:' + currentRouteName());
    const editFormRoute = controller.get('editFormRoute');
    openEditform('[data-test-olv]', null, assert, editFormRoute);
  });
});
