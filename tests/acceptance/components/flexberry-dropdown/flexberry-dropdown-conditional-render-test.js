import { run, later } from '@ember/runloop';
import { module, test } from 'qunit';
import startApp from '../../../helpers/start-app';
import $ from 'jquery';

let app;
const path = 'components-examples/flexberry-dropdown/conditional-render-example';
const testName = 'conditional render test';

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
  assert.expect(4);

  visit(path);
  andThen(() => {
    assert.equal(currentPath(), path, 'Path is correctly');

    let $dropdown = $('.flexberry-dropdown');
    assert.equal($dropdown.length, 1, 'Dropdown is render');

    // Select dropdown item.
    $dropdown.dropdown('set selected', 'Enum value №1');

    let done = assert.async();
    let timeout = 100;
    later((() => {
      let $dropdown = $('.flexberry-dropdown');
      assert.equal($dropdown.length, 0, 'Dropdown isn\'t render');

      let $span = $('div.field span');
      assert.equal($span.text(), 'Enum value №1', 'Span is render');
      done();
    }), timeout);
  });
});
