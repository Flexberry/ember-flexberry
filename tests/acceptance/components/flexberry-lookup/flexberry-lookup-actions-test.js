import $ from 'jquery';
import { run } from '@ember/runloop';
import { set } from '@ember/object';
import { executeTest } from './execute-flexberry-lookup-test';

executeTest('flexberry-lookup actions test', (store, assert, app) => {
  assert.expect(5);

  let controller = app.__container__.lookup('controller:components-acceptance-tests/flexberry-lookup/settings-example-actions');

  // Remap remove action.
  let $onRemoveData;
  set(controller, 'actions.externalRemoveAction', (actual) => {
    $onRemoveData = actual;
    assert.notEqual($onRemoveData, undefined, 'Component sends \'remove\' action after first click');
    assert.strictEqual($onRemoveData.relationName, 'type', 'Component sends \'remove\' with actual relationName');
  });

  // Remap chose action.
  let $onChooseData;
  set(controller, 'actions.externalChooseAction', (actual) => {
    $onChooseData = actual;
    assert.notEqual($onChooseData, undefined, 'Component sends \'choose\' action after first click');
    assert.strictEqual($onChooseData.componentName, 'flexberry-lookup',
     'Component sends \'choose\' with actual componentName');
    assert.strictEqual($onChooseData.projection, 'SettingLookupExampleView',
     'Component sends \'choose\' with actual projection');
  });

  visit('components-acceptance-tests/flexberry-lookup/settings-example-actions');
  andThen(function() {
    let $lookupButtouChoose = $('.ui-change');
    let $lookupButtouRemove = $('.ui-clear');

    run(() => {
      $lookupButtouChoose.click();
      $lookupButtouRemove.click();
    });
  });
});
