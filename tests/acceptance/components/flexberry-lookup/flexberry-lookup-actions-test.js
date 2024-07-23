import $ from 'jquery';
import { run } from '@ember/runloop';
import { set } from '@ember/object';
import { executeTest } from './execute-flexberry-lookup-test';
import { settled } from '@ember/test-helpers';

executeTest('flexberry-lookup actions test', async (store, assert, app) => {
  assert.expect(5);

  const controller = app.__container__.lookup('controller:components-acceptance-tests/flexberry-lookup/settings-example-actions');

  // Remap remove action.
  let $onRemoveData;
  set(controller, 'actions.externalRemoveAction', (actual) => {
    $onRemoveData = actual;
    assert.notEqual($onRemoveData, undefined, 'Component sends \'remove\' action after first click');
    assert.strictEqual($onRemoveData.relationName, 'type', 'Component sends \'remove\' with actual relationName');
  });

  // Remap choose action.
  let $onChooseData;
  set(controller, 'actions.externalChooseAction', (actual) => {
    $onChooseData = actual;
    assert.notEqual($onChooseData, undefined, 'Component sends \'choose\' action after first click');
    assert.strictEqual($onChooseData.componentName, 'flexberry-lookup', 'Component sends \'choose\' with actual componentName');
    assert.strictEqual($onChooseData.projection, 'SettingLookupExampleView', 'Component sends \'choose\' with actual projection');
  });

  await visit('components-acceptance-tests/flexberry-lookup/settings-example-actions');
  
  // Wait for the page to settle
  await settled();

  const $lookupButtonChoose = $('.ui-change');
  const $lookupButtonRemove = $('.ui-clear');

  // Simulate clicks on the buttons
  run(() => {
    $lookupButtonChoose.click();
    $lookupButtonRemove.click();
  });

  // Wait for any asynchronous operations to complete
  await settled();
});
