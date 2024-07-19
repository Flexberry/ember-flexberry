import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { registerWaiter } from '@ember/test';

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
    if (this.element.querySelector('.flexberry-modal')) {
      this.element.querySelector('.flexberry-modal').classList.remove('modal', 'hide', 'dimmer');
    }
  });

  test('it renders', function(assert) {
    this.render(hbs`
      {{#modal-dialog settings=settings created=createdConsumer}}
        template block text
      {{/modal-dialog}}
    `);

    return new Promise(resolve => {
      setTimeout(() => {
        assert.equal(this.element.querySelector('.content').textContent.trim(), 'template block text');
        resolve();
      }, 0);
    });
  });

  test('it should not show actions div if no buttons visible', function(assert) {
    this.render(hbs`
      {{#modal-dialog settings=settings created=createdConsumer useOkButton=false useCloseButton=false}}
        template block text
      {{/modal-dialog}}
    `);

    return new Promise(resolve => {
      setTimeout(() => {
        assert.equal(this.element.querySelectorAll('.actions').length, 0);
        resolve();
      }, 0);
    });
  });
});