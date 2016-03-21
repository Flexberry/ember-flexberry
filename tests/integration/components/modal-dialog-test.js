import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import wait from 'ember-test-helpers/wait';
import Ember from 'ember';

moduleForComponent('modal-dialog', 'Integration | Component | modal dialog', {
  integration: true
});

test('it renders', function (assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });"
  this.set('settings',
    {
      detachable: false
    });

  let created = false;

  this.set('createdConsumer', () => {
    created = true;
  });

  let waiter = function () {
    return created;
  };

  Ember.Test.registerWaiter(this, waiter);

  this.render(hbs`
    {{#modal-dialog settings=settings created=(action createdConsumer)}}
      template block text
    {{/modal-dialog}}
  `);

  return wait().then(() => {
    assert.equal(this.$('.description').text().trim(), 'template block text');
    this.$().modal('hide dimmer');
    Ember.Test.unregisterWaiter(waiter);
  });
});
