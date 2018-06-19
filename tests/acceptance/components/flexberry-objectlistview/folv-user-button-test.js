import { executeTest } from './execute-folv-test';
import $ from 'jquery';

executeTest('user button test', (store, assert, app) => {
  assert.expect(5);
  let path = 'components-examples/flexberry-objectlistview/toolbar-custom-buttons-example';

  visit(path);
  andThen(() => {
    assert.equal(currentPath(), path);

    let controller = app.__container__.lookup('controller:' + currentRouteName());
    let $testBudtton = $('.test-click-button')[0];

    // First click.
    $testBudtton.click();
    assert.equal(controller.clickCounter, 2, 'Test button was pressed');

    // Second click.
    $testBudtton.click();
    assert.equal(controller.clickCounter, 3, 'Test button was pressed');

    assert.notOk(controller.get('modelFromClickedRow'));
    click('.ui.button > .bug.icon:first');
    andThen(() => {
      assert.equal(controller.get('modelFromClickedRow.id'), controller.get('model.firstObject.id'));
    });
  });
});
