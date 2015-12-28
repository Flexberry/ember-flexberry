import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('groupedit-toolbar', 'Integration | Component | groupedit toolbar', {
  integration: true
});

test('it renders', function(assert) {
  assert.expect(2);

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{groupedit-toolbar componentName = "someName"}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#groupedit-toolbar componentName = "someName"}}
      template block text
    {{/groupedit-toolbar}}
  `);

  //Component does not support template block usage.
  assert.equal(this.$().text().trim(), '');
});
