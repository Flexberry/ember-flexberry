import { executeTest } from './execute-folv-test';

// Need to add sort by multiple columns.
executeTest('check delete record from edit form', (store, assert, app) => {
  assert.expect(1);
  let path = 'components-acceptance-tests/flexberry-objectlistview/folv-paging';
  visit(path);
  andThen(() => {

    // Check page path.
    assert.equal(currentPath(), path);

    let model = 'ember-flexberry-dummy-suggestion-type';
    let prop = 'name';
    checkDeleteRecordFromEditForm('[data-test-olv]', null, assert, store, model, prop);
  });
});
