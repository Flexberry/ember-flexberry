import { get } from '@ember/object';
import { executeTest } from './execute-flexberry-lookup-test';
import { settled } from '@ember/test-helpers';

executeTest('flexberry-lookup relation name test', async (store, assert, app) => {
  assert.expect(1);
  
  await visit('components-acceptance-tests/flexberry-lookup/settings-example-relation-name');
  
  await settled(); // Дождаться завершения всех асинхронных операций

  let controller = app.__container__.lookup('controller:' + currentRouteName());
  let relationName = get(controller, 'relationName');
  
  assert.strictEqual(
    relationName,
    'Temp relation name',
    `relationName: '${relationName}' as expected`
  );
});
