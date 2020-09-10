import { executeTest } from './execute-folv-test';

executeTest('check sorting on all column', (store, assert, app) => {
  assert.expect(1);
  let path = 'components-acceptance-tests/flexberry-objectlistview/base-operations';
  visit(path);
  andThen(() => {

    // Check page path.
    assert.equal(currentPath(), path);

    checkOlvSortOnAllColumns('[data-test-olv]', null, assert);
  });
});
