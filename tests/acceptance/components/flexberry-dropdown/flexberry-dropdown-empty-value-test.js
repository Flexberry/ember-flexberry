import { module, test } from 'qunit';
import { run } from '@ember/runloop';
import startApp from '../../../helpers/start-app';
import $ from 'jquery';

let app;
const path = 'components-examples/flexberry-dropdown/empty-value-example';
const testName = 'empty value test';

module('Acceptance | flexberry-dropdown | ' + testName, {
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

test(testName, (assert) => {
  assert.expect(3);

  visit(path);
  andThen(() => {
    assert.equal(currentPath(), path, 'Path is correctly');

    let $dropdown = $('.flexberry-dropdown');
    assert.equal($dropdown.length, 1, 'Dropdown is render');
    assert.equal($dropdown[0].innerText, 'Enum value №2', 'Dropdown value is "Enum value №2"');
  });
});
