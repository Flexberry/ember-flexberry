import { run } from '@ember/runloop';
import { module, test } from 'qunit';
import startApp from '../../../helpers/start-app';
import {settled} from '@ember/test-helpers';

let app;
const testName = 'user button test';

module('Acceptance | flexberry-groupedit | ' + testName, {
    beforeEach() {

      // Start application.
      app = startApp();

      // Enable acceptance test mode in application controller (to hide unnecessary markup from application.hbs).
      let applicationController = app.__container__.lookup('controller:application');
      applicationController.set('isInAcceptanceTestMode', true);
    },

    afterEach() {
      run(app, 'destroy');
    }
  });

test(testName, async function(assert)  {
  assert.expect(3);
  let path = 'components-examples/flexberry-groupedit/custom-buttons-example';

  await visit(path);
  await settled();
    assert.equal(currentPath(), path);

    let controller = app.__container__.lookup('controller:' + currentRouteName());

    // Enable the hi button.
    await click('.toggle-hi-button');

    // First click.
    await click('.test-click-button');
    await settled();
     assert.equal(controller.clickCounter, 2, 'Test button was pressed');

    // Second click.
    await click('.test-click-button');
   await settled(); 
   assert.equal(controller.clickCounter, 3, 'Test button was pressed');
  });
