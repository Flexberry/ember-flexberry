import { executeTest } from './execute-folv-test';

executeTest('check folv config', (store, assert, app) => {
  const path = 'components-acceptance-tests/flexberry-objectlistview/base-operations';
  visit(path);
  andThen(() => {
    const config = [
      'createNewButton',
      'deleteButton',
      'refreshButton',
      'showCheckBoxInRow',
      'showDeleteMenuItemInRow'
    ];
    app.testHelpers.checkOlvConfig('[data-test-olv]', null, config);
  });
});
