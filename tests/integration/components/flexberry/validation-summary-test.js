import { A } from '@ember/array';
import { run } from '@ember/runloop';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

// eslint-disable-next-line ember/no-test-module-for
moduleForComponent('flexberry/validation-summary', 'Integration | Component | flexberry/validation-summary', {
  integration: true
});

test('it renders and works', function(assert) {
  // eslint-disable-next-line ember/no-test-this-render, hbs/check-hbs-template-literals
  this.render(hbs`{{flexberry/validation-summary errors=errors color=color header=header}}`);

  const errors = this.set('errors', A());
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

  // eslint-disable-next-line ember/no-test-this-render, hbs/check-hbs-template-literals
  this.render(hbs`{{flexberry/validation-summary}}`);

  assert.ok(this.$('.ui.message').hasClass('red'), `Default color 'red'.`);
});
