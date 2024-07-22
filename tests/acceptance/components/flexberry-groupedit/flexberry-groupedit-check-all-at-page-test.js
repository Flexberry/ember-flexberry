import $ from 'jquery';
import { run } from '@ember/runloop';
import { module, test } from 'qunit';
import { loadingList } from '../flexberry-objectlistview/folv-tests-functions';
import { setupApplicationTest } from 'ember-qunit';
import { set } from '@ember/object';
import { visit, currentURL } from '@ember/test-helpers';
import startApp from '../../../helpers/start-app';

let app;
const path = 'components-examples/flexberry-groupedit/configurate-row-example';
const testName = 'check all at page';
const olvContainerClass = '.object-list-view-container';
const trTableClass = 'table.object-list-view tbody tr';

module('Acceptance | flexberry-groupedit | ' + testName, function(hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(function() {
    // Start application.
    app = startApp();

    // Enable acceptance test mode in application controller (to hide unnecessary markup from application.hbs).
    let applicationController = app.__container__.lookup('controller:application');
    set(applicationController, 'isInAcceptanceTestMode', true);
  });

  hooks.afterEach(function() {
    run(app, 'destroy');
  });

  test(testName, async function(assert) {
    assert.expect(4);

    await visit(path);
    assert.equal(currentURL(), path, 'Path is correctly');

    const $olv = $('.object-list-view');
    const $thead = $('th.dt-head-left', $olv).first();

    await run(async () => {
      const $list = await loadingList($thead, olvContainerClass, trTableClass);

      assert.ok($list);
      const $rows = $('.object-list-view-helper-column', $list);

      await click('.ui.check-all-at-page-button');
      let $checkCheckBox = $('.flexberry-checkbox.checked', $rows);
      assert.equal($checkCheckBox.length, $rows.length, 'All checkBox in row are select');

      await click('.ui.check-all-at-page-button');
      $checkCheckBox = $('.flexberry-checkbox.checked', $rows);
      assert.equal($checkCheckBox.length, 0, 'All checkBox in row are unselect');
    });
  });
});


