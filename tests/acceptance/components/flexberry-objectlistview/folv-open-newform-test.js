import { executeTest } from './execute-folv-test';

executeTest('check goto new form', (store, assert, app) => {
  const path = 'components-acceptance-tests/flexberry-objectlistview/base-operations';
  visit(path);
  andThen(() => {
    const controller = app.__container__.lookup('controller:' + currentRouteName());
    const newFormRoute = controller.get('editFormRoute') + '.new';
    app.testHelpers.goToNewForm('[data-test-olv]', null, newFormRoute);
  });
});
