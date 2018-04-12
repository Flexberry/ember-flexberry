import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('flexberry-validationsummary', 'Integration | Component | flexberry-validationsummary', {
  integration: true
});

test('it renders and works', function(assert) {
  this.render(hbs`{{flexberry-validationsummary errors=errors color=color header=header}}`);

  let errors = this.set('errors', Ember.A());
  assert.ok(this.$('.ui.message').is(':hidden'), 'Component is hidden if no errors.');

  Ember.run(() => {
    errors.pushObject('Validation error.');
  });
  assert.ok(this.$('.ui.message').is(':visible'), 'Component is visible if there errors.');
  assert.ok(this.$().text().trim(), 'Validation error.', 'Component shows errors at added.');

  this.set('header', 'Validation errors');
  assert.ok(/Validation errors\s*/.test(this.$().text().trim()), 'Component has a header.');

  assert.notOk(this.$('.ui.label').hasClass('red'), 'Override default color with undefined value.');

  this.set('color', 'blue');
  assert.ok(this.$('.ui.message').hasClass('blue'), 'Color works through CSS class.');

  this.render(hbs`{{flexberry-validationsummary}}`);
  assert.ok(this.$('.ui.message').hasClass('red'), `Default color 'red'.`);
});
