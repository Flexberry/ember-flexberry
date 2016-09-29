import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('object-list-view-rows-portion', 'Integration | Component | object list view rows portion', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{object-list-view-rows-portion}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#object-list-view-rows-portion}}
      template block text
    {{/object-list-view-rows-portion}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
