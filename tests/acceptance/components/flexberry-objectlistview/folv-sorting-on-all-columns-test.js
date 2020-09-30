import { executeTest } from './execute-folv-test';

executeTest('check sorting on all column', (store, assert, app) => {
  const path = 'components-acceptance-tests/flexberry-objectlistview/base-operations';
  visit(path);
  andThen(() => {

    // Check page path.
    assert.equal(currentPath(), path);

    checkOlvSortOnAllColumns('[data-test-olv]', null, assert);
  });
});
