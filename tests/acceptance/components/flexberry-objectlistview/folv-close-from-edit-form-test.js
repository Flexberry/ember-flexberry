import { executeTest } from './execute-folv-test';
import { settled } from '@ember/test-helpers';

executeTest('check close button from edit form', async (store, assert) => {
  assert.expect(1);
  const path = 'components-acceptance-tests/flexberry-objectlistview/folv-paging';

  await visit(path);
  assert.equal(currentPath(), path, 'Visited the correct path');

  await settled(); // Ждем завершения всех асинхронных действий
  checkCloseEditForm('[data-test-olv]', null, assert, path);
});
