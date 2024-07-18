import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | flexberry-error', function(hooks) {
  setupRenderingTest(hooks);
  test('Component renders properly', async function(assert) {
    this.set('error', new Error('Error, error, error...'));
    await render(hbs`{{flexberry-error error=error modalContext='body'}}`);
    assert.ok(/Error, error, error.../.test(this.element.textContent), 'Error message is displayed correctly');
  });
});

