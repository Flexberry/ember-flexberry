import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { registerWaiter } from '@ember/test';
import wait from 'ember-test-helpers/wait';

module('Integration | Component | modal-dialog', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    this.set('settings', { detachable: false });
    this.set('created', false);
    this.set('createdConsumer', () => {
      this.set('created', true);
    });
    registerWaiter(this, () => this.get('created'));
  });

  hooks.afterEach(function() {
    // This might cause an error if the modal is not present
    this.$('.flexberry-modal').modal('hide dimmer');
  });

  test('it renders', async function(assert) {
    await render(hbs`
      {{#modal-dialog settings=settings created=createdConsumer}}
        template block text
      {{/modal-dialog}}
    `);

    assert.equal(this.element.querySelector('.content').textContent.trim(), 'template block text');
  });

  test('it should not show actions div if no buttons visible', async function(assert) {
    await render(hbs`
      {{#modal-dialog settings=settings created=createdConsumer useOkButton=false useCloseButton=false}}
        template block text
      {{/modal-dialog}}
    `);

    return wait().then(() => {
      assert.equal(this.$('.actions').length, 0);
    });
  });
});

