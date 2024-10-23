import $ from 'jquery';
import { run } from '@ember/runloop';
import { module, test } from 'qunit';
import { loadingList } from '../flexberry-objectlistview/folv-tests-functions';
import { setupApplicationTest } from 'ember-qunit';
import { visit, currentURL, settled, findAll, find, click, waitFor } from '@ember/test-helpers';

const olvContainerClass = '.object-list-view-container';
const trTableClass = 'table.object-list-view tbody tr';
const path = 'components-examples/flexberry-groupedit/configurate-row-example';

module('Acceptance | flexberry-groupedit | check all at page', function (hooks) {
  setupApplicationTest(hooks);

  test('check all at page', async function (assert) {
    assert.expect(4);

    await visit(path);
    await settled();

    assert.equal(currentURL(), path);

    let $olv = $('.object-list-view');
    let $thead = $('th.dt-head-left', $olv);

    await new Promise(resolve => setTimeout(resolve, 1000));
    let $list = loadingList($thead, olvContainerClass, trTableClass);
    assert.ok($list);

    let $rows = $('.object-list-view-helper-column', $list);

    await waitFor('.ui.check-all-at-page-button', { timeout: 10000 });
    await click('.ui.check-all-at-page-button');
    await settled();
    let $checkCheckBox = $('.flexberry-checkbox.checked', $rows);
    assert.equal($checkCheckBox.length, $rows.length, 'All checkBox in row are select');

    await waitFor('.ui.check-all-at-page-button', { timeout: 10000 });

    await click('.ui.check-all-at-page-button');
    await settled();

    $checkCheckBox = $('.flexberry-checkbox.checked', $rows);
    assert.equal($checkCheckBox.length, 0, 'All checkBox in row are unselect');
  });
});
