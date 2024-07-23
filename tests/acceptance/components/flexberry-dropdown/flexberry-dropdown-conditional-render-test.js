import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { visit, currentURL } from '@ember/test-helpers';
import { set } from '@ember/object';
import $ from 'jquery';

const path = 'components-examples/flexberry-dropdown/conditional-render-example';
const testName = 'conditional render test';

module('Acceptance | flexberry-dropdown | ' + testName, function(hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(function() {
    // Enable acceptance test mode in application controller (to hide unnecessary markup from application.hbs).
    let applicationController = this.owner.lookup('controller:application');
    set(applicationController, 'isInAcceptanceTestMode', true);
  });

  test(testName, async function(assert) {
    assert.expect(4);

    await visit(path);
    assert.equal(currentURL(), path, 'Path is correctly');

    let $dropdown = $('.flexberry-dropdown');
    assert.equal($dropdown.length, 1, 'Dropdown is rendered');

    // Select dropdown item.
    run(() => {
      $dropdown.dropdown('set selected', 'Enum value №1');
    });

    const done = assert.async();
    const timeout = 100;
    later(() => {
      const $dropdown = $('.flexberry-dropdown');
      assert.equal($dropdown.length, 0, 'Dropdown isn\'t rendered');

      const $span = $('div.field span');
      assert.equal($span.text(), 'Enum value №1', 'Span is rendered');
      done();
    }, timeout);
  });
});
