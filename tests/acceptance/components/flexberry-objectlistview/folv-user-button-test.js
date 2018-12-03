import { executeTest } from './execute-folv-test';

executeTest('user button test', (store, assert, app) => {
  assert.expect(5);
  let path = 'components-examples/flexberry-objectlistview/toolbar-custom-buttons-example';

  visit(path);
  andThen(() => {
    assert.equal(currentPath(), path);

    let controller = app.__container__.lookup('controller:' + currentRouteName());

    // Enable the hi button.
    click('.toggle-hi-button');

    // First click.
    click('.test-click-button');
    andThen(() => assert.equal(controller.clickCounter, 2, 'Test button was pressed'));

    // Second click.
    click('.test-click-button');
    andThen(() => assert.equal(controller.clickCounter, 3, 'Test button was pressed'));

    assert.notOk(controller.get('modelFromClickedRow'));
    click('.ui.button > .bug.icon:first');
    andThen(() => {
      assert.equal(controller.get('modelFromClickedRow.id'), controller.get('model.firstObject.id'));
    });
  });
});
