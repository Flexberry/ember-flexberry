import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import wait from 'ember-test-helpers/wait';
import { registerWaiter } from '@ember/test';

moduleForComponent('modal-dialog', 'Integration | Component | modal dialog', {
  integration: true,

  beforeEach() {
    // detachable need for jquery can do select child components
    this.set('settings', {
      detachable: false
    });

    this.set('created', false);
    this.set('createdConsumer', () => {
      this.set('created', true);
    });

    registerWaiter(this, () => this.get('created'));
  },

  afterEach() {
    this.$('.flexberry-modal').modal('hide dimmer');
  }
});

test('it renders', function (assert) {
  this.render(hbs`
    {{#modal-dialog settings=settings created=createdConsumer}}
      template block text
    {{/modal-dialog}}
  `);

  return wait().then(() => {
    assert.equal(this.$('.description').text().trim(), 'template block text');
  });
});

test('it should not show actions div if no buttons visible', function(assert) {
  this.render(hbs`
    {{#modal-dialog settings=settings created=createdConsumer useOkButton=false useCloseButton=false}}
      template block text
    {{/modal-dialog}}
  `);

  return wait().then(() => {
    assert.equal(this.$('.actions').length, 0);
  });
});
