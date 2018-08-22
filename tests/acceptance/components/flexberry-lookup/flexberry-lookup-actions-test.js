import Ember from 'ember';
import { executeTest } from './execute-flexberry-lookup-test';

executeTest('flexberry-lookup actions test', (store, assert, app) => {
  assert.expect(5);

  let controller = app.__container__.lookup('controller:components-acceptance-tests/flexberry-lookup/settings-example-actions');

  // Remap remove action.
  let $onRemoveData;
  Ember.set(controller, 'actions.externalRemoveAction', (actual) => {
    $onRemoveData = actual;
    assert.notEqual($onRemoveData, undefined, 'Component sends \'remove\' action after first click');
    assert.strictEqual($onRemoveData.relationName, 'type', 'Component sends \'remove\' with actual relationName');
  });

  // Remap chose action.
  let $onChooseData;
  Ember.set(controller, 'actions.externalChooseAction', (actual) => {
    $onChooseData = actual;
    assert.notEqual($onChooseData, undefined, 'Component sends \'choose\' action after first click');
    assert.strictEqual($onChooseData.componentName, 'flexberry-lookup',
     'Component sends \'choose\' with actual componentName');
    assert.strictEqual($onChooseData.projection, 'SettingLookupExampleView',
     'Component sends \'choose\' with actual projection');
  });

  visit('components-acceptance-tests/flexberry-lookup/settings-example-actions');
  andThen(function() {
    let $lookupButtouChoose = Ember.$('.ui-change');
    let $lookupButtouRemove = Ember.$('.ui-clear');

    Ember.run(() => {
      $lookupButtouChoose.click();
      $lookupButtouRemove.click();
    });
  });
});
