import { isBlank } from '@ember/utils';
import { click, settled } from '@ember/test-helpers';
import { executeTest } from './execute-flexberry-lookup-test';

executeTest('flexberry-lookup autofillByLimit in readonly test', async (store, assert) => {
  assert.expect(1);
  await visit('components-acceptance-tests/flexberry-lookup/settings-example-autofill-by-limit');
  const $lookupField = document.querySelector('.isreadonly .lookup-field');
  const value = $lookupField.value;
  assert.ok(isBlank(value), 'Value was changed');
});

executeTest('flexberry-lookup autofillByLimit is clean test', async (store, assert) => {
  assert.expect(2);
  await visit('components-acceptance-tests/flexberry-lookup/settings-example-autofill-by-limit');
  await settled();
  const $lookupField = document.querySelector('.isclean .lookup-field');
  const value = $lookupField.value;
  assert.notOk(isBlank(value), 'Value wasn\'t changed');

  const $clearButton = document.querySelector('.isclean .ui-clear');
  await click($clearButton);

  // Wait for any potential async operations to complete
  await settled();

  const valueUpdate = $lookupField.value;
  assert.ok(isBlank(valueUpdate), 'Value isn\'t empty');

});

executeTest('flexberry-lookup autofillByLimit changes select value test', async (store, assert, app) => {
  assert.expect(1);
  await visit('components-acceptance-tests/flexberry-lookup/settings-example-autofill-by-limit');

  const controller = app.__container__.lookup('controller:' + currentRouteName());
  const defaultValue = controller.defaultValue.id;

  const $lookupField = document.querySelector('.exist .lookup-field');
  const value = $lookupField.value;

  assert.notEqual(
    defaultValue,
    value,
    'DefaultValue: \'' + defaultValue + '\' didn\'t change'
  );
});
