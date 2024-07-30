import { executeTest } from './execute-folv-test';

executeTest('check delete record from olv', async (store, assert) => {
  assert.expect(1);
  
  const path = 'components-acceptance-tests/flexberry-objectlistview/folv-paging';
  await visit(path);
  
  assert.equal(currentPath(), path, 'Correct path is visited');

  const model = 'ember-flexberry-dummy-suggestion-type';
  const prop = 'name';
  
  await checkDeleteRecordFromOlv('[data-test-olv]', null, assert, store, model, prop);
});
