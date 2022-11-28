import $ from 'jquery';
import { run } from '@ember/runloop';
import { module, test } from 'qunit';
import { loadingList } from '../flexberry-objectlistview/folv-tests-functions';
import startApp from '../../../helpers/start-app';

let app;
const path = 'components-examples/flexberry-groupedit/configurate-row-example';
const testName = 'check all at page';
let olvContainerClass = '.object-list-view-container';
let trTableClass = 'table.object-list-view tbody tr';

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
  assert.expect(4);

  visit(path);

  andThen(() => {
    assert.equal(currentPath(), path);

    let $olv = $('.object-list-view ');
    let $thead = $('th.dt-head-left', $olv)[0];

    run(() => {
      let done = assert.async();
      loadingList($thead, olvContainerClass, trTableClass).then(($list) => {
        assert.ok($list);
        let $rows = $('.object-list-view-helper-column', $list);

        click('.ui.check-all-at-page-button');
        andThen(() => {
          let $checkCheckBox = $('.flexberry-checkbox.checked', $rows);
          assert.equal($checkCheckBox.length, $rows.length, 'All checkBox in row are select');

          click('.ui.check-all-at-page-button');
          andThen(() => {
            $checkCheckBox = $('.flexberry-checkbox.checked', $rows);
            assert.equal($checkCheckBox.length, 0, 'All checkBox in row are unselect');
          });
        });

        done();
      });
    });
  });
});
