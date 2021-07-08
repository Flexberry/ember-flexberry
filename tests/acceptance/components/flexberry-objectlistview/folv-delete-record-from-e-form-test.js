import { skip } from 'qunit';

// Need to add sort by multiple columns.
skip('check delete record from edit form', (store, assert) => {
  assert.expect(1);
  const path = 'components-acceptance-tests/flexberry-objectlistview/folv-paging';
  visit(path);
  andThen(() => {

    // Check page path.
    assert.equal(currentPath(), path);

    const model = 'ember-flexberry-dummy-suggestion-type';
    const prop = 'name';
    checkDeleteRecordFromEditForm('[data-test-olv]', null, assert, store, model, prop);
  });
});
