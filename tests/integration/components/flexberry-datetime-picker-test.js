import { inject as service } from '@ember/service';
import Component from '@ember/component';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('flexberry-datepicker', 'Integration | Component | Flexberry datepicker', {
  integration: true,

  beforeEach: function () {
    Component.reopen({
      i18n: service('i18n')
    });
  }
});

test('it renders', function(assert) {
  assert.expect(2);

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{flexberry-datepicker}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#flexberry-datepicker}}
      template block text
    {{/flexberry-datepicker}}
  `);

  //Component does not support template block usage.
  assert.equal(this.$().text().trim(), '');
});
