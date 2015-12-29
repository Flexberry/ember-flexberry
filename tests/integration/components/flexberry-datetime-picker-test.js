import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('flexberry-datetime-picker', 'Integration | Component | datetime picker', {
  integration: true
});

test('it renders', function(assert) {
  assert.expect(2);

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{flexberry-datetime-picker}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#flexberry-datetime-picker}}
      template block text
    {{/flexberry-datetime-picker}}
  `);

  //Component does not support template block usage.
  assert.equal(this.$().text().trim(), '');
});
