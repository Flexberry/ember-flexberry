import { executeTest } from './execute-folv-test';

executeTest('check folv config', (store, assert) => {
  const path = 'components-acceptance-tests/flexberry-objectlistview/base-operations';
  visit(path);
  andThen(() => {
    const config = [
      'createNewButton',
      'deleteButton',
      'refreshButton',
      'showDeleteMenuItemInRow'
    ];
    checkOlvConfig('[data-test-olv]', null, assert, config);
  });
});
