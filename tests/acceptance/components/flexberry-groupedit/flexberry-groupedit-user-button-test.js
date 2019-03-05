import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from '../../../helpers/start-app';

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
      Ember.run(app, 'destroy');
    }
  });

test(testName, (assert) => {
  assert.expect(3);
  let path = 'components-examples/flexberry-groupedit/custom-buttons-example';

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
  });
});
