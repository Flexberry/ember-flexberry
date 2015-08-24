import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('datetime-picker', 'Integration | Component | datetime picker', {
  integration: true
});

test('it renders', function(assert) {
  assert.expect(2);

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{datetime-picker}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#datetime-picker}}
      template block text
    {{/datetime-picker}}
  `);

  //Component does not support template block usage.
  assert.equal(this.$().text().trim(), '');
});
