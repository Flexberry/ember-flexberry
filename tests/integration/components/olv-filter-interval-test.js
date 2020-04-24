import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('olv-filter-interval', 'Integration | Component | olv filter interval', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{olv-filter-interval}}`);

  assert.equal(this.$().text().trim(), '');
});
