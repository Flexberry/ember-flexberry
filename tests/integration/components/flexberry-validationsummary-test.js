import { module, test } from 'qunit';
import { A } from '@ember/array';
import { run } from '@ember/runloop';
import hbs from 'htmlbars-inline-precompile';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';

module( 'Integration | Component | flexberry-validationsummary', function(hooks) {
  setupRenderingTest(hooks);

test('it renders and works',async function(assert) {
  await render(hbs`{{flexberry-validationsummary errors=errors color=color header=header}}`);

  let errors = this.set('errors', A());
  assert.ok(this.$('.ui.message').is(':hidden'), 'Component is hidden if no errors.');

  run(() => {
    errors.pushObject('Validation error.');
  });
  assert.ok(this.$('.ui.message').is(':visible'), 'Component is visible if there errors.');
  assert.ok(this.$().text().trim(), 'Validation error.', 'Component shows errors at added.');

  this.set('header', 'Validation errors');
  assert.ok(/Validation errors\s*/.test(this.$().text().trim()), 'Component has a header.');

  assert.notOk(this.$('.ui.label').hasClass('red'), 'Override default color with undefined value.');

  this.set('color', 'blue');
  assert.ok(this.$('.ui.message').hasClass('blue'), 'Color works through CSS class.');

  await render(hbs`{{flexberry-validationsummary}}`);
  assert.ok(this.$('.ui.message').hasClass('red'), `Default color 'red'.`);
  });
});

