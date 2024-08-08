import $ from 'jquery';
import { run } from '@ember/runloop';
import { module, test } from 'qunit';
import { loadingList } from '../flexberry-objectlistview/folv-tests-functions';
import startApp from '../../../helpers/start-app';
import { settled } from '@ember/test-helpers';

let app;
const path = 'components-examples/flexberry-groupedit/configurate-row-example';
const testName = 'check all at page';
var olvContainerClass = '.object-list-view-container';
var trTableClass = 'table.object-list-view tbody tr';

module('Acceptance | flexberry-groupedit | ' + testName,  {
  //setupApplicationTest(hooks);
  beforeEach () {

    // Start application.
    app = startApp();

    // Enable acceptance test mode in application controller (to hide unnecessary markup from application.hbs).
    let applicationController = app.__container__.lookup('controller:application');
    applicationController.set('isInAcceptanceTestMode', true);
  },

  afterEach () {
    run(app, 'destroy');
  }
});

  test(testName, async function (assert) {
    assert.expect(4);

    await visit(path);

    //await settled();

    assert.equal(currentPath(), path);

    let $olv = $('.object-list-view ');
    let $thead = $('th.dt-head-left', $olv)[0];


    let $list = await loadingList($thead, olvContainerClass, trTableClass);
    assert.ok($list);
    let $rows = $('.object-list-view-helper-column', $list);

    await click('.ui.check-all-at-page-button');
    await settled();
    let $checkCheckBox = $('.flexberry-checkbox.checked', $rows);
    assert.equal($checkCheckBox.length, $rows.length, 'All checkBox in row are select');

    await click('.ui.check-all-at-page-button');
    await settled();

    $checkCheckBox = $('.flexberry-checkbox.checked', $rows);
    assert.equal($checkCheckBox.length, 0, 'All checkBox in row are unselect');
  });
