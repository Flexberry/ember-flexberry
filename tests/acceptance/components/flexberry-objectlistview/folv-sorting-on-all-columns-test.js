import { skip } from 'qunit';

skip('check sorting on all column', (store, assert) => {
  const path = 'components-acceptance-tests/flexberry-objectlistview/base-operations';
  visit(path);
  andThen(() => {

    // Check page path.
    assert.equal(currentPath(), path);

    checkOlvSortOnAllColumns('[data-test-olv]', null, assert);
  });
});
