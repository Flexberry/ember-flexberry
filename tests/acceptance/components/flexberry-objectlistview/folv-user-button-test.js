import { executeTest } from './execute-folv-test';
import {settled} from '@ember/test-helpers';

executeTest('user button test', async (store, assert, app) => {
  assert.expect(5);
  let path = 'components-examples/flexberry-objectlistview/toolbar-custom-buttons-example';

  await visit(path);
  assert.equal(currentPath(), path);

  let controller = app.__container__.lookup('controller:' + currentRouteName());

    // Enable the hi button.
  await click('.toggle-hi-button');

    // First click.
  await click('.test-click-button');
  assert.equal(controller.clickCounter, 2, 'Test button was pressed');

  // Second click.
  click('.test-click-button');
  andThen(() => assert.equal(controller.clickCounter, 3, 'Test button was pressed'));

  assert.notOk(controller.get('modelFromClickedRow'));
  await click('.ui.button > .bug.icon:first');
  await settled;
  assert.equal(controller.get('modelFromClickedRow.id'), controller.get('model.firstObject.id'))
});