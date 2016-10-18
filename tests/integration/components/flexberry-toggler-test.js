import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('flexberry-toggler', 'Integration | Component | flexberry toggler', {
  integration: true
});

test('Something done', function(assert) {
    assert.equal(1, 1);
  });

test('it renders', function(assert) {

  this.render(hbs`{{flexberry-toggler}}`);

  assert.equal(this.$().text().trim(), '');

  this.render(hbs`
    {{#flexberry-toggler}}
      template block text
    {{/flexberry-toggler}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});

