import { get } from '@ember/object';
import { executeTest } from './execute-flexberry-lookup-test';

executeTest('flexberry-lookup relation name test', (store, assert, app) => {
  assert.expect(1);
  visit('components-acceptance-tests/flexberry-lookup/settings-example-relation-name');
  andThen(function() {
    let controller = app.__container__.lookup('controller:' + currentRouteName());
    let relationName = get(controller, 'relationName');
    assert.strictEqual(
      relationName,
      'Temp relation name',
      'relationName: \'' + relationName + '\' as expected');
  });
});
