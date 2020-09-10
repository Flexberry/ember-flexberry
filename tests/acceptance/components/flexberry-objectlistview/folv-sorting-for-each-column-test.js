import { executeTest } from './execute-folv-test';

executeTest('check sorting for each column', (store, assert, app) => {
  assert.expect(1);
  let path = 'components-acceptance-tests/flexberry-objectlistview/base-operations';
  visit(path);
  andThen(() => {

    // Check page path.
    assert.equal(currentPath(), path);

    checkOlvSortForEachColumn('[data-test-olv]', null, assert);
  });
});
