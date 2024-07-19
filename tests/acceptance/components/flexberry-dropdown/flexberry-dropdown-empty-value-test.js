import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { visit, currentURL } from '@ember/test-helpers';
import { run } from '@ember/runloop';
import { set } from '@ember/object';
import $ from 'jquery';

const path = 'components-examples/flexberry-dropdown/empty-value-example';
const testName = 'empty value test';

module('Acceptance | flexberry-dropdown | ' + testName, function(hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(function() {
    // Enable acceptance test mode in application controller (to hide unnecessary markup from application.hbs).
    let applicationController = this.owner.lookup('controller:application');
    set(applicationController, 'isInAcceptanceTestMode', true);
  });

  hooks.afterEach(function() {
    run(this.owner, 'destroy');
  });

  test(testName, async function(assert) {
    assert.expect(3);

    await visit(path);
    assert.equal(currentURL(), path, 'Path is correctly');

    const $dropdown = $('.flexberry-dropdown');
    assert.equal($dropdown.length, 1, 'Dropdown is rendered');
    assert.equal($dropdown[0].innerText.trim(), 'Enum value №2', 'Dropdown value is &quot;Enum value №2&quot;');
  });
});
