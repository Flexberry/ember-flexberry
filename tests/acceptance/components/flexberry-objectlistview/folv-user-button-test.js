import Ember from 'ember';
import { executeTest} from './execute-folv-test';

executeTest('user button test', (store, assert, app) => {
  assert.expect(3);
  let path = 'components-examples/flexberry-objectlistview/toolbar-custom-buttons-example';

  visit(path);
  andThen(() => {
    assert.equal(currentPath(), path);

    let controller = app.__container__.lookup('controller:' + currentRouteName());
    let $testBudtton = Ember.$('.test-click-button')[0];

    // First click.
    $testBudtton.click();
    assert.equal(controller.clickCounter, 2, 'Test button was pressed');

    // Second click.
    $testBudtton.click();
    assert.equal(controller.clickCounter, 3, 'Test button was pressed');
  });
});
