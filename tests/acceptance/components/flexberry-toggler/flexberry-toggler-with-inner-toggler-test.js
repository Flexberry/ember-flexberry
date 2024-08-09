import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { visit, currentURL, fillIn, click, findAll } from '@ember/test-helpers';
import { run } from '@ember/runloop';
import $ from 'jquery';

const path = 'components-examples/flexberry-toggler/settings-example-inner';
const testName = 'flexberry-toggler with inner toggler test';

module('Acceptance | flexberry-toggler | ' + testName, function(hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(function() {
    // Enable acceptance test mode in application controller (to hide unnecessary markup from application.hbs).
    let applicationController = this.owner.lookup('controller:application');
    applicationController.set('isInAcceptanceTestMode', true);

    let controller = this.owner.lookup('controller:components-examples/flexberry-toggler/settings-example-inner');
    controller.set('duration', 0);
  });

  test(testName, async function(assert) {
    await visit(path);
    assert.equal(currentURL(), path, 'Path is correct');

    let rows = $('table.flexberry-word-break tbody tr');
    let caption = $('.ember-text-field', rows[0]);
    await fillIn(caption[0], 'Caption text example');
    
    let title1 = findAll('.title')[0].innerText;
    assert.equal(caption[0].value, title1, 'Caption is correct');

    let expandedInnerCaption = $('.ember-text-field', rows[5]);
    let collapsedInnerCaption = $('.ember-text-field', rows[6]);
    await fillIn(expandedInnerCaption[0], 'Expanded inner caption text example');
    await fillIn(collapsedInnerCaption[0], 'Collapsed inner caption text example');

    let expandedCaption = $('.ember-text-field', rows[1]);
    let collapsedCaption1 = $('.ember-text-field', rows[2]);
    await fillIn(expandedCaption[0], 'Expanded caption text example');
    await fillIn(collapsedCaption1[0], 'Collapsed caption text example');

    let toggler = findAll('.flexberry-toggler .title');
    assert.equal(collapsedInnerCaption[0].value, toggler[1].innerText, 'Collapsed inner caption is correct');

    await click(toggler[1]);
    assert.equal(expandedInnerCaption[0].value, toggler[1].innerText, 'Expanded inner caption is correct');
    assert.equal(expandedCaption[0].value, toggler[0].innerText, 'Expanded caption is correct');

    let expandedCheckbox = rows[3].querySelector('input[type="checkbox"]');
    assert.equal(expandedCheckbox.checked, true, 'expanded=true');

    await click(toggler[0]);
    assert.equal(collapsedCaption[0].value, toggler[0].innerText, 'Collapsed caption is correct');
    assert.equal(expandedCheckbox.checked, false, 'expanded=false');

    await click(expandedCheckbox);
    assert.equal(expandedCheckbox.checked, true, 'expanded=true');

    let expandedInnerCheckbox = rows[7].querySelector('input[type="checkbox"]');
    assert.equal(expandedInnerCheckbox.checked, true, 'inner expanded=true');

    await click(expandedInnerCheckbox);
    assert.equal(expandedInnerCheckbox.checked, false, 'inner expanded=false');
    assert.equal(expandedCheckbox.checked, true, 'expanded=true');

    let icon = findAll('.flexberry-toggler .title .icon')[0];
    assert.equal(icon.className, 'dropdown icon', 'dropdown icon');

    let collapsedCaption2 = $('.ember-text-field', rows[8]);
    await fillIn(collapsedCaption2[0], 'paw icon');
    assert.equal(icon.className, 'paw icon', 'paw icon');
  });
});