import { executeTest } from './execute-folv-test';

executeTest('check close button from edit form', (store, assert) => {
  assert.expect(1);
  const path = 'components-acceptance-tests/flexberry-objectlistview/folv-paging';
  visit(path);
  andThen(() => {

    // Check page path.
    assert.equal(currentPath(), path);

    checkCloseEditForm('[data-test-olv]', null, assert, path);
  });
});
