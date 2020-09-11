import { executeTest } from './execute-folv-test';

executeTest('check delete record from olv', (store, assert, app) => {
  assert.expect(1);
  let path = 'components-acceptance-tests/flexberry-objectlistview/folv-paging';
  visit(path);
  andThen(() => {
    assert.equal(currentPath(), path);

    let model = 'ember-flexberry-dummy-suggestion-type';
    let prop = 'name';
    checkDeleteRecordFromOlv('[data-test-olv]', null, assert, store, model, prop);
  });
});
