import { module, test } from 'qunit';
import hbs from 'htmlbars-inline-precompile';
import { render } from '@ember/test-helpers';
import { setupRenderingTest } from 'ember-qunit';

module('Integration | Component | groupedit toolbar', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    assert.expect(2);

    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    await render(hbs`{{groupedit-toolbar componentName = "someName"}}`);

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    await render(hbs`
      {{#groupedit-toolbar componentName = "someName"}}
        template block text
      {{/groupedit-toolbar}}
    `);


    //Component does not support template block usage.
    assert.equal(this.$().text().trim(), '');
  });
});

