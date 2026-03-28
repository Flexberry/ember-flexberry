import { module, test } from 'qunit';
import { visit, currentURL } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import { settled } from '@ember/test-helpers';
import $ from 'jquery';

const path = 'components-examples/flexberry-dropdown/empty-value-example';
const testName = 'empty value test';

module('Acceptance | flexberry-dropdown | ' + testName, function(hooks) {
  setupApplicationTest(hooks);

  test(testName, async function(assert) {
    assert.expect(3);

    await visit(path);
    assert.equal(currentURL(), `${path}`, 'Path is correctly');

    await settled();

    let $dropdown = $('.flexberry-vertical-form .flexberry-dropdown');
    assert.equal($dropdown.length, 1, 'Dropdown is rendered');
    assert.equal($dropdown[0].innerText.trim(), 'Enum value №2', 'Dropdown value is "Enum value №2"');
  });
});
