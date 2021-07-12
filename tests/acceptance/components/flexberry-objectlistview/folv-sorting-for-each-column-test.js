import { skip } from 'qunit';

skip('check sorting for each column', (store, assert) => {
  assert.expect(1);
  const path = 'components-acceptance-tests/flexberry-objectlistview/base-operations';
  visit(path);
  andThen(() => {

    // Check page path.
    assert.equal(currentPath(), path);

    checkOlvSortForEachColumn('[data-test-olv]', null, assert);
  });
});
