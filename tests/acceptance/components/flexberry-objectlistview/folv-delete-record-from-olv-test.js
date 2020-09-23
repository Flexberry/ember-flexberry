import { executeTest } from './execute-folv-test';

executeTest('check delete record from olv', (store, assert, app) => {
  assert.expect(1);
  const path = 'components-acceptance-tests/flexberry-objectlistview/folv-paging';
  visit(path);
  andThen(() => {
    assert.equal(currentPath(), path);

    const model = 'ember-flexberry-dummy-suggestion-type';
    const prop = 'name';
    checkDeleteRecordFromOlv('[data-test-olv]', null, assert, store, model, prop);
  });
});
