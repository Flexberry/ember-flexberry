import { executeTest } from './execute-folv-test';
import { settled } from '@ember/test-helpers';

executeTest('check folv config', async (store, assert) => {
  const path = 'components-acceptance-tests/flexberry-objectlistview/base-operations';
  
  await visit(path);
  await settled(); // Ждем завершения всех асинхронных действий

  const config = [
    'createNewButton',
    'deleteButton',
    'refreshButton',
    'showDeleteMenuItemInRow'
  ];
  
  checkOlvConfig('[data-test-olv]', null, assert, config);
});
