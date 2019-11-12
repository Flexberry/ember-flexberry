import { module, test } from 'qunit';
import { run } from '@ember/runloop';
import startApp from '../../../helpers/start-app';
import $ from 'jquery';

let app;
const path = 'components-examples/flexberry-groupedit/configurate-row-example';
const testName = 'configurate row';

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

test(testName, (assert) => {
  assert.expect(58);

  visit(path);
  andThen(() => {
    assert.equal(currentPath(), path, 'Path is correctly');
    let $folvRows = $('.object-list-view-container tbody tr');

    for (let i = 0; i < $folvRows.length; i++) {
      let $row = $folvRows[i];
      let $deleteButton = $('.object-list-view-row-delete-button', $row);
      let $flagField = $('.field .flexberry-checkbox', $row);

      if (i % 2 === 0)
      {
        assert.equal($deleteButton.hasClass('disabled'), true, 'Delete button in an even row is disabled');
        assert.equal($flagField.hasClass('checked'), true, 'CheckBox in an even row is checked');
      } else {
        assert.equal($deleteButton.hasClass('disabled'), false, 'Delete button in a non-even row isn\'t disabled');
        assert.equal($flagField.hasClass('checked'), false, 'CheckBox in an even row isn\'t checked');
      }

      let $textField = $('.field .flexberry-textbox input', $row);
      assert.equal($textField[0].value, i + 1 + 'test', 'TextBox have currect text');
    }
  });
});
