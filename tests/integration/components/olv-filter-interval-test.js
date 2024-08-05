import { module, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { render } from '@ember/test-helpers';
import { setupRenderingTest } from 'ember-qunit';
import $ from 'jquery';

module('Integration | Component | olv-filter-interval', function(hooks){
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    await render(hbs`{{olv-filter-interval}}`);
    assert.equal($(this.element).text().trim(), '');
  });
});
