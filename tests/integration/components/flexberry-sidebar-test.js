import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | flexberry-sidebar', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    await render(hbs`{{flexberry-sidebar}}`);
    assert.equal(this.element.textContent.trim(), '', 'Component renders with no content');
    await render(hbs` {{#flexberry-sidebar}} text {{/flexberry-sidebar}}`);
    assert.equal(this.element.textContent.trim(), 'text', 'Component renders with content');
  });
});