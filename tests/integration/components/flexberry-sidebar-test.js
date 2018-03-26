import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('flexberry-sidebar', 'Integration | Component | flexberry-sidebar', {
  integration: true
});

test('it renders', function(assert) {
  this.render(hbs`{{flexberry-sidebar}}`);
  assert.equal(this.$().text().trim(), '');

  this.render(hbs`{{#flexberry-sidebar}}text{{/flexberry-sidebar}}`);
  assert.equal(this.$().text().trim(), 'text');
});
